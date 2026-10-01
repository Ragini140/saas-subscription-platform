const { Worker } = require("bullmq");
const { Redis } = require("ioredis");
const { env } = require("../config/env");
const { Subscription, User } = require("../models");
const { sendInvoiceEmail } = require("../services/email.service");

const connection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

const renewalWorker = new Worker(
  "renewal-reminders",
  async (job) => {
    const { subscriptionId } = job.data;

    const subscription = await Subscription.findByPk(subscriptionId, {
      include: User,
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    try {
      await sendInvoiceEmail({
        to: subscription.User.email,
        customerName: subscription.User.name || "Customer",
        plan: subscription.plan,
        amount: 999,
        currency: "usd",
        invoiceNumber: `RENEWAL-${subscription.id}`,
      });

      console.log(`Renewal reminder sent: ${subscription.User.email}`);
    } catch (error) {
      console.error("Failed to send renewal email:", error.message);
    }
  },
  {
    connection,
  },
);

renewalWorker.on("completed", (job) => {
  console.log(`Renewal job completed: ${job.id}`);
});

renewalWorker.on("failed", (job, error) => {
  console.error(`Renewal job failed: ${job?.id}`, error);
});

module.exports = { renewalWorker };
