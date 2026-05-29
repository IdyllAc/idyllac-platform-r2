'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    // 2️⃣ Convert column
    await queryInterface.sequelize.query(`
      ALTER TABLE "ledger_accounts"
      ALTER COLUMN "accountType"
      TYPE "enum_ledger_accounts_accountType"
      USING ("accountType"::"enum_ledger_accounts_accountType");
    `);

  },

  async down(queryInterface, Sequelize) {

    // revert back to STRING
    await queryInterface.sequelize.query(`
      ALTER TABLE "ledger_accounts"
      ALTER COLUMN "accountType"
      TYPE VARCHAR(255);
    `);

  }
};