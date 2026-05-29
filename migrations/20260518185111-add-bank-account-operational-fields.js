'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'bank_accounts',
      'isFrozen',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );

    await queryInterface.addColumn(
      'bank_accounts',
      'allowsInternationalTransfers',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    );

    await queryInterface.addColumn(
      'bank_accounts',
      'dailyTransferLimit',
      {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 10000
      }
    );

    await queryInterface.addColumn(
      'bank_accounts',
      'monthlyTransferLimit',
      {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 100000
      }
    );

    await queryInterface.addColumn(
      'bank_accounts',
      'activatedAt',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    );

  },

  async down(queryInterface) {

    await queryInterface.removeColumn(
      'bank_accounts',
      'isFrozen'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'allowsInternationalTransfers'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'dailyTransferLimit'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'monthlyTransferLimit'
    );

    await queryInterface.removeColumn(
      'bank_accounts',
      'activatedAt'
    );

  }

};