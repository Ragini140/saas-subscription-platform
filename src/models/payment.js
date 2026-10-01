const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    subscriptionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCEEDED", "FAILED"),
      allowNull: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Payment",
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ["userId"] }, { fields: ["subscriptionId"] }],
  },
);

module.exports = { Payment };
