'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_transfers_status"
      ADD VALUE IF NOT EXISTS 'AUTHORIZED';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_transfers_status"
      ADD VALUE IF NOT EXISTS 'SETTLED';
    `);

    
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_transfers_status"
      ADD VALUE IF NOT EXISTS 'REVERSED';
    `);

  },

  async down(queryInterface, Sequelize) {

    // PostgreSQL ENUM rollback is difficult.
    // Leave empty safely.

  }

};