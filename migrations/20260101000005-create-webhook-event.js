"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WebhookEvent", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      razorpayEventId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      processedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("WebhookEvent");
  },
};
