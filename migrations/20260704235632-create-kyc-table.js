'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

      await queryInterface.createTable('kyc', {

          id: {

              type: Sequelize.INTEGER,

              primaryKey: true,

              autoIncrement: true,

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

          status: {

              type: Sequelize.ENUM(

                  'PENDING',

                  'APPROVED',

                  'REJECTED',

                  'SUSPENDED'

              ),

              allowNull: false,

              defaultValue: 'PENDING'

          },

          submittedAt: {

              type: Sequelize.DATE,

              allowNull: false,

              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

          },

          reviewedAt: {

              type: Sequelize.DATE,

              allowNull: true

          },

          reviewedBy: {

              type: Sequelize.INTEGER,

              allowNull: true

          },

          riskScore: {

              type: Sequelize.INTEGER,

              allowNull: false,

              defaultValue: 0

          },

          notes: {

              type: Sequelize.TEXT,

              allowNull: true

          },

          createdAt: {

              type: Sequelize.DATE,

              allowNull: false,

              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

          },

          updatedAt: {

              type: Sequelize.DATE,

              allowNull: false,

              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

          }

      });

      await queryInterface.addIndex(

          'kyc',

          ['userId'],

          {

              name: 'kyc_userId_idx'

          }

      );

      await queryInterface.addIndex(

          'kyc',

          ['status'],

          {

              name: 'kyc_status_idx'

          }

      );

  },

  async down(queryInterface) {

      await queryInterface.removeIndex(

          'kyc',

          'kyc_status_idx'

      );

      await queryInterface.removeIndex(

          'kyc',

          'kyc_userId_idx'

      );

      await queryInterface.dropTable('kyc');

  }

};
