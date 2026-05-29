'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('ledger_accounts', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      accountType: {
        type: Sequelize.STRING,
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: 'EUR'
      },

      balance: {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 0
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }

    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('ledger_accounts');

  }

};