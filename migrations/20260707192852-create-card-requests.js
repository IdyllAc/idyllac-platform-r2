'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

      await queryInterface.createTable('card_requests', {

          id: {

              allowNull: false,

              autoIncrement: true,

              primaryKey: true,

              type: Sequelize.INTEGER

          },

          userId: {

              type: Sequelize.INTEGER,

              allowNull: false,

              references: {

                  model: 'users',

                  key: 'id'

              }

          },

          bankAccountId: {

              type: Sequelize.INTEGER,

              allowNull: false,

              references: {

                  model: 'bank_accounts',

                  key: 'id'

              }

          },

          cardHolderName: {

              type: Sequelize.STRING,

              allowNull: false

          },

          currency: {

              type: Sequelize.STRING,

              allowNull: false,

              defaultValue: 'EUR'

          },

          type: {

              type: Sequelize.STRING,

              allowNull: false

          },

          level: {

              type: Sequelize.STRING,

              allowNull: false

          },

          physical: {

              type: Sequelize.BOOLEAN,

              defaultValue: true

          },

          virtual: {

              type: Sequelize.BOOLEAN,

              defaultValue: false

          },

          status: {

              type: Sequelize.ENUM(

                  'REQUESTED',

                  'APPROVED',

                  'GENERATED',

                  'CANCELLED'

              ),

              allowNull: false,

              defaultValue: 'REQUESTED'

          },

          requestedAt: Sequelize.DATE,

          approvedAt: Sequelize.DATE,

          generatedAt: Sequelize.DATE,

          cancelledAt: Sequelize.DATE,

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

  async down(queryInterface) {

      await queryInterface.dropTable('card_requests');

  }

};
