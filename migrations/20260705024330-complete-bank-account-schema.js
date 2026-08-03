'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

    // -------------------------------------------------------
    // Extend Account Type ENUM
    // -------------------------------------------------------

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bank_accounts_type"
      ADD VALUE IF NOT EXISTS 'CRYPTO';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bank_accounts_type"
      ADD VALUE IF NOT EXISTS 'VAULT';
    `);

    // -------------------------------------------------------
    // ledgerAccountNumber
    // -------------------------------------------------------

    await queryInterface.addColumn(
      'bank_accounts',
      'ledgerAccountNumber',
      {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }
    );

    // -------------------------------------------------------
    // isFrozen
    // -------------------------------------------------------

    await queryInterface.addColumn(
      'bank_accounts',
      'isFrozen',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );

    // -------------------------------------------------------
    // activatedAt
    // -------------------------------------------------------

    await queryInterface.addColumn(
      'bank_accounts',
      'activatedAt',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    );

    // -------------------------------------------------------
    // allowsInternationalTransfers
    // -------------------------------------------------------

    await queryInterface.addColumn(
      'bank_accounts',
      'allowsInternationalTransfers',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    );

    // -------------------------------------------------------
    // dailyTransferLimit
    // -------------------------------------------------------

    await queryInterface.addColumn(
      'bank_accounts',
      'dailyTransferLimit',
      {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
        defaultValue: 10000
      }
    );

    // -------------------------------------------------------
    // monthlyTransferLimit
    // -------------------------------------------------------

    await queryInterface.addColumn(
      'bank_accounts',
      'monthlyTransferLimit',
      {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
        defaultValue: 100000
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      'bank_accounts',
      'ledgerAccountNumber'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'isFrozen'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'activatedAt'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'allowsInternationalTransfers'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'dailyTransferLimit'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'monthlyTransferLimit'
    );

    // PostgreSQL intentionally does NOT support removing ENUM
    // values safely. We leave CRYPTO and VAULT in the enum.

  }

};
