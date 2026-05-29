'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('transactions', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      bankAccountId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'bank_accounts',
          key: 'id'
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      cardId: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: 'cards',
          key: 'id'
        },

        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },

      reference: {
        type: Sequelize.STRING,
        unique: true
      },

      type: {
        type: Sequelize.ENUM(
          'DEPOSIT',
          'WITHDRAWAL',
          'TRANSFER',
          'CARD_PAYMENT',
          'REFUND',
          'FEE'
        ),
        allowNull: false
      },

      direction: {
        type: Sequelize.ENUM(
          'CREDIT',
          'DEBIT'
        ),
        allowNull: false
      },

      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: 'EUR'
      },

      description: {
        type: Sequelize.STRING
      },

      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'COMPLETED',
          'FAILED',
          'REVERSED'
        ),
        defaultValue: 'COMPLETED'
      },

      balanceBefore: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },

      balanceAfter: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
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

    await queryInterface.dropTable('transactions');

  }

};