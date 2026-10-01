const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const WebhookEvent = sequelize.define(
  "WebhookEvent",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    razorpayEventId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "WebhookEvent",
    timestamps: false,
  },
);

module.exports = { WebhookEvent };
