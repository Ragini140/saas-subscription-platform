const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Subscription = sequelize.define(
  "Subscription",
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
    razorpayCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpaySubscriptionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "CANCELED",
        "EXPIRED",
        "PAST_DUE",
        "INCOMPLETE",
      ),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Subscription",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["status"] },
      { fields: ["endDate"] },
    ],
  },
);

module.exports = { Subscription };
