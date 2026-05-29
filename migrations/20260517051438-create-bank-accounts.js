'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('bank_accounts', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id'
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      accountName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      iban: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      bic: {
        type: Sequelize.STRING,
        allowNull: false
      },

      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: 'EUR'
      },

      balance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },

      availableBalance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },

      type: {
        type: Sequelize.ENUM(
          'CHECKING',
          'SAVINGS',
          'BUSINESS'
        ),
        defaultValue: 'CHECKING'
      },

      status: {
        type: Sequelize.ENUM(
          'ACTIVE',
          'SUSPENDED',
          'CLOSED'
        ),
        defaultValue: 'ACTIVE'
      },

      country: {
        type: Sequelize.STRING,
        defaultValue: 'FR'
      },

      isJointAccount: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });

  },

  async down(queryInterface) {

    await queryInterface.dropTable('bank_accounts');

  }

};