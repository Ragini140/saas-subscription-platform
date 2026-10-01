const { User } = require("../models");
const { razorpay } = require("../config/razorpay");
const { env } = require("../config/env");

async function createCheckoutSession(userId) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: env.razorpayPlanId,
    customer_notify: 1,
    total_count: 12,
    notes: {
      userId: String(userId),
    },
  });

  // short_url is the hosted page where the customer completes payment.
  return {
    url: subscription.short_url,
    id: subscription.id,
  };
}

module.exports = { createCheckoutSession };
