"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payment", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "User", key: "id" },
      },
      subscriptionId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "Subscription", key: "id" },
      },
      razorpayPaymentId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("PENDING", "SUCCEEDED", "FAILED"),
        allowNull: false,
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("Payment", ["userId"]);
    await queryInterface.addIndex("Payment", ["subscriptionId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Payment");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Payment_status";',
    );
  },
};
