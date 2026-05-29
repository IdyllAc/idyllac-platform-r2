'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'bank_accounts',
      'ledgerBalance',
      {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      }
    );
    
    await queryInterface.addColumn(
      'bank_accounts',
      'pendingBalance',
      {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      }
    );
    
    await queryInterface.addColumn(
      'bank_accounts',
      'blockedBalance',
      {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0
      }
    );
    
    await queryInterface.addColumn(
      'bank_accounts',
      'accountCategory',
      {
        type: Sequelize.STRING,
        defaultValue: 'PERSONAL'
      }
    );
    
    await queryInterface.addColumn(
      'bank_accounts',
      'isPrimary',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );
    
    await queryInterface.addColumn(
      'bank_accounts',
      'isClosed',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );
    
    await queryInterface.addColumn(
      'bank_accounts',
      'closedAt',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    );
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('bank_accounts', 'ledgerBalance');
  
    await queryInterface.removeColumn('bank_accounts', 'pendingBalance');
  
    await queryInterface.removeColumn('bank_accounts', 'blockedBalance');
  
    await queryInterface.removeColumn('bank_accounts', 'accountCategory');
  
    await queryInterface.removeColumn('bank_accounts', 'isPrimary');
  
    await queryInterface.removeColumn('bank_accounts', 'isClosed');
  
    await queryInterface.removeColumn('bank_accounts', 'closedAt');
  
  }
};
