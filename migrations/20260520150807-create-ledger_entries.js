'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ledger_entries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    
      ledgerAccountId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    
      transferId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
    
      type: {
        type: Sequelize.ENUM('DEBIT', 'CREDIT'),
        allowNull: false
      },
    
      amount: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: false
      },
    
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
    
      description: {
        type: Sequelize.STRING
      },
    
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('ledger_entries');
  
  }
};
