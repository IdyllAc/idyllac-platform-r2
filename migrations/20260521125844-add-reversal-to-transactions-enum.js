'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_transactions_type"
      ADD VALUE IF NOT EXISTS 'REVERSAL';
    `);

  },

  async down(queryInterface, Sequelize) {

    // PostgreSQL ENUM rollback is complex.
    // Leave empty intentionally.

  }

};
