'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

      await queryInterface.sequelize.query(`

          ALTER TYPE "enum_cards_status"

          RENAME TO "enum_cards_status_old";

      `);

      await queryInterface.sequelize.query(`

          CREATE TYPE "enum_cards_status"

          AS ENUM (

              'REQUESTED',

              'GENERATED',

              'ACTIVE',

              'BLOCKED',

              'REPLACED',

              'EXPIRED',

              'CLOSED',

              'CANCELLED'

          );

      `);


      await queryInterface.sequelize.query(`

          ALTER TABLE cards
          ALTER COLUMN status
          DROP DEFAULT;


          ALTER TABLE cards

          ALTER COLUMN status

          TYPE "enum_cards_status"

          USING (

              CASE

                  WHEN status='active'

                      THEN 'ACTIVE'

                  WHEN status='blocked'

                      THEN 'BLOCKED'

                  WHEN status='expired'

                      THEN 'EXPIRED'

                  WHEN status='pending'

                      THEN 'REQUESTED'

                      ELSE 'REQUESTED'

              END

          )::"enum_cards_status";

          ALTER TABLE cards
          ALTER COLUMN status
          SET DEFAULT 'REQUESTED';

      `);

      await queryInterface.sequelize.query(`

          DROP TYPE "enum_cards_status_old";

      `);

  },

  async down(queryInterface) {

      await queryInterface.sequelize.query(`

          ALTER TYPE "enum_cards_status"

          RENAME TO "enum_cards_status_new";

      `);

      await queryInterface.sequelize.query(`

          CREATE TYPE "enum_cards_status"

          AS ENUM (

              'active',

              'blocked',

              'expired',

              'pending'

          );

      `);

      await queryInterface.sequelize.query(`

          ALTER TABLE cards
          ALTER COLUMN status
          DROP DEFAULT;

          ALTER TABLE cards

          ALTER COLUMN status

          TYPE "enum_cards_status"

          USING (

              CASE

                  WHEN status='ACTIVE'

                      THEN 'active'

                  WHEN status='BLOCKED'

                      THEN 'blocked'

                  WHEN status='EXPIRED'

                      THEN 'expired'

                  WHEN status IN ('REQUESTED','GENERATED')

                      THEN 'pending'

                  WHEN status='REPLACED'

                      THEN 'blocked'

                  WHEN status='CLOSED'

                      THEN 'blocked'

                  WHEN status='CANCELLED'

                      THEN 'pending'

                      ELSE 'pending'

              END

          )::"enum_cards_status";

          ALTER TABLE cards
          ALTER COLUMN status
          SET DEFAULT 'pending';

      `);

      await queryInterface.sequelize.query(`

          DROP TYPE "enum_cards_status_new";

      `);

  }

};
