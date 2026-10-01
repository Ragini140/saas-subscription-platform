const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Invoice = sequelize.define(
  "Invoice",
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
    invoiceNumber: {
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
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Invoice",
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ["userId"] }, { fields: ["subscriptionId"] }],
  },
);

module.exports = { Invoice };
