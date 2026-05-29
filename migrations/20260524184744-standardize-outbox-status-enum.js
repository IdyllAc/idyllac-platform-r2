'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

    // =========================
    // 1. RENAME OLD ENUM
    // =========================

    try {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_outbox_events_status"
        RENAME TO "enum_outbox_events_status_old";
      `);
    } catch (err) {
      console.log('Old enum already renamed');
    }

    // =========================
    // 2. CREATE NEW ENUM
    // =========================

    try {
      await queryInterface.sequelize.query(`
        CREATE TYPE "enum_outbox_events_status"
        AS ENUM (
          'PENDING',
          'PROCESSING',
          'COMPLETED',
          'FAILED',
          'DEAD_LETTER'
        );
      `);
    } catch (err) {
      console.log('New enum already exists');
    }

    // =========================
    // 3. CONVERT COLUMN
    // =========================

    await queryInterface.sequelize.query(`
      ALTER TABLE "outbox_events"
      ALTER COLUMN "status" DROP DEFAULT;
    `);
    
    await queryInterface.sequelize.query(`
      ALTER TABLE "outbox_events"
      ALTER COLUMN "status"
      TYPE "enum_outbox_events_status"
      USING (
        CASE
          WHEN status::text = 'PROCESSED'
          THEN 'COMPLETED'
          ELSE status::text
        END
      )::"enum_outbox_events_status";
    `);

    // =========================
    // 4. SET DEFAULT
    // =========================

    await queryInterface.sequelize.query(`
      ALTER TABLE "outbox_events"
      ALTER COLUMN "status"
      SET DEFAULT 'PENDING';
    `);

    // =========================
    // 5. DROP OLD ENUM
    // =========================

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_outbox_events_status_old";
    `);

  },

  async down(queryInterface, Sequelize) {

    // =========================
    // REVERSE MIGRATION
    // =========================

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_outbox_events_status"
      RENAME TO "enum_outbox_events_status_new";
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_outbox_events_status" AS ENUM (
        'PENDING',
        'PROCESSED',
        'FAILED'
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "outbox_events"
      ALTER COLUMN "status"
      TYPE "enum_outbox_events_status"
      USING (
        CASE
          WHEN status::text = 'COMPLETED'
          THEN 'PROCESSED'
          WHEN status::text = 'PROCESSING'
          THEN 'PENDING'
          WHEN status::text = 'DEAD_LETTER'
          THEN 'FAILED'
          ELSE status::text
        END
      )::"enum_outbox_events_status";
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_outbox_events_status_new";
    `);

  }

};
