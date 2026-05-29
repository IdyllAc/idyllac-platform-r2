'use strict';

/** @type {import('sequelize-cli').Migration} */

'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('transfers', {

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

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      senderAccountId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'bank_accounts',
          key: 'id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      beneficiaryId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'beneficiaries',
          key: 'id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      reference: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },

      transferType: {
        type: Sequelize.ENUM(
          'INTERNAL',
          'SEPA',
          'SWIFT',
          'ACH',
          'FPS'
        ),
        defaultValue: 'SEPA'
      },

      direction: {
        type: Sequelize.ENUM(
          'OUTBOUND',
          'INBOUND'
        ),
        defaultValue: 'OUTBOUND'
      },

      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },

      feeAmount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      },

      exchangeRate: {
        type: Sequelize.DECIMAL(18, 8),
        defaultValue: 1
      },

      sourceCurrency: {
        type: Sequelize.STRING,
        defaultValue: 'EUR'
      },

      destinationCurrency: {
        type: Sequelize.STRING,
        defaultValue: 'EUR'
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true
      },

      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'PROCESSING',
          'COMPLETED',
          'FAILED',
          'REVERSED'
        ),
        defaultValue: 'PENDING'
      },

      executedAt: {
        type: Sequelize.DATE,
        allowNull: true
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

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('transfers');

  }

};