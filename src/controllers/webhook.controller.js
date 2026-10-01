const crypto = require("node:crypto");
const { env } = require("../config/env");
const { Subscription, Payment, Invoice, User, WebhookEvent } = require("../models");
const { generateInvoicePdf } = require("../services/invoice.service");
const { sendInvoiceEmail } = require("../services/email.service");

// Checks the x-razorpay-signature header against an HMAC of the raw body.
function isValidSignature(rawBody, signature) {
  if (!signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

// Razorpay usually sends an x-razorpay-event-id header, but it is not always
// present. Fall back to a stable key built from the event payload so the
// idempotency check never gets an empty value.
function getEventId(headerEventId, event) {
  if (headerEventId) {
    return headerEventId;
  }

  const payment = event.payload.payment?.entity;
  const subscription = event.payload.subscription?.entity;
  const entityId = payment?.id || subscription?.id || "unknown";

  return `${event.event}:${entityId}`;
}

async function razorpayWebhookController(req, res) {
  const signature = req.headers["x-razorpay-signature"];

  // req.body is a raw Buffer here (see the raw body parser on this route).
  if (!isValidSignature(req.body, signature)) {
    return res.status(400).json({
      error: "Invalid Razorpay signature",
    });
  }

  try {
    const event = JSON.parse(req.body.toString());
    const eventId = getEventId(req.headers["x-razorpay-event-id"], event);

    console.log("Razorpay event received:", event.event);

    // Prevent duplicate processing
    const existingEvent = await WebhookEvent.findOne({
      where: {
        razorpayEventId: eventId,
      },
    });

    if (existingEvent) {
      console.log("Webhook already processed:", eventId);

      return res.status(200).json({
        received: true,
      });
    }

    if (event.event === "subscription.activated") {
      const sub = event.payload.subscription.entity;

      const userId = Number(sub.notes?.userId);

      if (!Number.isInteger(userId)) {
        throw new Error("Invalid userId in Razorpay notes");
      }

      const subscriptionValues = {
        userId,
        razorpayCustomerId: sub.customer_id || null,
        razorpaySubscriptionId: sub.id,
        plan: "Pro Monthly",
        status: "ACTIVE",
        startDate: new Date(sub.current_start * 1000),
        endDate: new Date(sub.current_end * 1000),
      };

      const existingSubscription = await Subscription.findOne({
        where: { razorpaySubscriptionId: sub.id },
      });

      if (existingSubscription) {
        await existingSubscription.update({
          razorpayCustomerId: subscriptionValues.razorpayCustomerId,
          plan: "Pro Monthly",
          status: "ACTIVE",
          startDate: subscriptionValues.startDate,
          endDate: subscriptionValues.endDate,
        });
      } else {
        await Subscription.create(subscriptionValues);
      }

      console.log("Subscription saved:", sub.id);
    }

    if (event.event === "subscription.charged") {
      const sub = event.payload.subscription.entity;
      const payment = event.payload.payment.entity;

      let subscription = await Subscription.findOne({
        where: { razorpaySubscriptionId: sub.id },
      });

      // subscription.charged can arrive before subscription.activated, so wait
      // briefly and look again before giving up.
      if (!subscription) {
        console.log("Subscription not found yet. Waiting for activation webhook...");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        subscription = await Subscription.findOne({
          where: { razorpaySubscriptionId: sub.id },
        });
      }

      if (!subscription) {
        throw new Error(`Subscription not found: ${sub.id}`);
      }

      const existingPayment = await Payment.findOne({
        where: { razorpayPaymentId: payment.id },
      });

      if (existingPayment) {
        await existingPayment.update({
          amount: payment.amount,
          currency: payment.currency,
          status: "SUCCEEDED",
          paidAt: new Date(),
        });
      } else {
        await Payment.create({
          userId: subscription.userId,
          subscriptionId: subscription.id,
          razorpayPaymentId: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: "SUCCEEDED",
          paidAt: new Date(),
        });
      }

      console.log("Payment saved:", payment.id);

      const user = await User.findByPk(subscription.userId);

      if (!user) {
        throw new Error(`User not found: ${subscription.userId}`);
      }

      const invoiceNumber = `INV-${payment.id}`;

      const filePath = await generateInvoicePdf({
        invoiceNumber,
        customerName: user.name || "Customer",
        customerEmail: user.email,
        plan: subscription.plan,
        amount: payment.amount,
        currency: payment.currency,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        paidAt: new Date(),
      });

      const existingInvoice = await Invoice.findOne({
        where: { invoiceNumber },
      });

      if (existingInvoice) {
        await existingInvoice.update({
          amount: payment.amount,
          currency: payment.currency,
          filePath,
        });
      } else {
        await Invoice.create({
          userId: subscription.userId,
          subscriptionId: subscription.id,
          invoiceNumber,
          amount: payment.amount,
          currency: payment.currency,
          filePath,
        });
      }

      console.log("Invoice generated:", invoiceNumber);

      try {
        await sendInvoiceEmail({
          to: user.email,
          customerName: user.name || "Customer",
          plan: subscription.plan,
          amount: payment.amount,
          currency: payment.currency,
          invoiceNumber,
        });

        console.log("Invoice email sent:", user.email);
      } catch (error) {
        console.error("Failed to send invoice email:", error.message);
      }
    }

    await WebhookEvent.create({
      razorpayEventId: eventId,
      eventType: event.event,
    });

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing failed:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
}

module.exports = { razorpayWebhookController };
