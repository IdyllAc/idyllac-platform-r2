'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'ledger_entries',
      'originalAmount',
      {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'ledger_entries',
      'originalCurrency',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'ledger_entries',
      'fxRate',
      {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: true
      }
    );

  },

  async down(queryInterface) {

    await queryInterface.removeColumn('ledger_entries', 'originalAmount');
    await queryInterface.removeColumn('ledger_entries', 'originalCurrency');
    await queryInterface.removeColumn('ledger_entries', 'fxRate');

  }
};