'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

      await queryInterface.addColumn(

          'cards',

          'closedAt',

          {

              type: Sequelize.DATE,

              allowNull: true

          }

      );

  },

  async down(queryInterface) {

      await queryInterface.removeColumn(

          'cards',

          'closedAt'

      );

  }

};
