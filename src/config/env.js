require("dotenv").config();

const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayPlanId: process.env.RAZORPAY_PLAN_ID,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  mailtrapHost: process.env.MAILTRAP_HOST,
  mailtrapPort: Number(process.env.MAILTRAP_PORT) || 2525,
  mailtrapUser: process.env.MAILTRAP_USER,
  mailtrapPass: process.env.MAILTRAP_PASS,
  mailFrom: process.env.MAIL_FROM,
};

module.exports = { env };
