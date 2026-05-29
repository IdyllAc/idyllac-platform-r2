'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'ledger_entries',
      'reference',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'TEMP-REF'
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      'ledger_entries',
      'reference'
    );

  }

};
