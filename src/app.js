const express = require("express");
const { ValidationError } = require("express-validation");
const userRoutes = require("./routes/user.routes");
const subscription = require("./routes/subscription.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const { razorpayWebhookController } = require("./controllers/webhook.controller");
const invoiceRoutes = require("./routes/invoice.routes");
const metricsRoutes = require("./routes/metrics.routes");

const app = express();

app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhookController,
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscription);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/metrics", metricsRoutes);

// Handle validation errors from express-validation.
app.use((err, _req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return next(err);
});

module.exports = { app };
