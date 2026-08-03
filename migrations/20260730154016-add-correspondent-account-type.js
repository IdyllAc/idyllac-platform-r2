'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_ledger_accounts_accountType"
      ADD VALUE IF NOT EXISTS 'CORRESPONDENT';
    `);
  },

  async down() {
    // PostgreSQL cannot easily remove enum values.
    // Intentionally left empty.
  }
};
