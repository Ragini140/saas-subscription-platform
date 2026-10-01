"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subscription", {
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
      razorpayCustomerId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      razorpaySubscriptionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      plan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "ACTIVE",
          "CANCELED",
          "EXPIRED",
          "PAST_DUE",
          "INCOMPLETE",
        ),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("Subscription", ["userId"]);
    await queryInterface.addIndex("Subscription", ["status"]);
    await queryInterface.addIndex("Subscription", ["endDate"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Subscription");
    // Drop the enum type created for the status column.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Subscription_status";',
    );
  },
};
