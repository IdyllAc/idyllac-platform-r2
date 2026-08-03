'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface) {

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_beneficiaries_status"
      ADD VALUE IF NOT EXISTS 'VERIFIED';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_beneficiaries_status"
      ADD VALUE IF NOT EXISTS 'DEACTIVATED';
    `);

  },

  async down() {

    // PostgreSQL ENUM rollback intentionally omitted.

  }

};
