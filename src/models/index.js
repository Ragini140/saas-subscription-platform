const { sequelize } = require("../db/sequelize");
const { User } = require("./user");
const { Subscription } = require("./subscription");
const { Payment } = require("./payment");
const { Invoice } = require("./invoice");
const { WebhookEvent } = require("./webhookEvent");

// Associations
User.hasMany(Subscription, { foreignKey: "userId" });
Subscription.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Invoice, { foreignKey: "userId" });
Invoice.belongsTo(User, { foreignKey: "userId" });

Subscription.hasMany(Payment, { foreignKey: "subscriptionId" });
Payment.belongsTo(Subscription, { foreignKey: "subscriptionId" });

Subscription.hasMany(Invoice, { foreignKey: "subscriptionId" });
Invoice.belongsTo(Subscription, { foreignKey: "subscriptionId" });

module.exports = { sequelize, User, Subscription, Payment, Invoice, WebhookEvent };
