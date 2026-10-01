const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.mailtrapHost,
  port: env.mailtrapPort,
  auth: {
    user: env.mailtrapUser,
    pass: env.mailtrapPass,
  },
});

async function sendInvoiceEmail(data) {
  const invoiceUrl =
    `http://localhost:${env.port}/api/invoices/${data.invoiceNumber}`;

  await transporter.sendMail({
    from: env.mailFrom,
    to: data.to,
    subject: `Payment successful - ${data.plan}`,
    html: `
      <h2>Payment Successful</h2>

      <p>Hello ${data.customerName},</p>

      <p>Your subscription payment was successful.</p>

      <p>
        <strong>Plan:</strong> ${data.plan}<br>
        <strong>Amount:</strong> ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}<br>
        <strong>Status:</strong> PAID
      </p>

      <p>
        <a href="${invoiceUrl}">View Invoice</a>
      </p>

      <p>Thank you for subscribing.</p>
    `,
  });
}

module.exports = { sendInvoiceEmail };
