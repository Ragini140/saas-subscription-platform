"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Invoice", {
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
      invoiceNumber: {
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
      filePath: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("Invoice", ["userId"]);
    await queryInterface.addIndex("Invoice", ["subscriptionId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Invoice");
  },
};
