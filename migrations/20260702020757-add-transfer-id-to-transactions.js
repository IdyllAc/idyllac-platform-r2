'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    // Add transferId column
    await queryInterface.addColumn(

      'transactions',

      'transferId',

      {

        type: Sequelize.INTEGER,

        allowNull: true,

        references: {

          model: 'transfers',

          key: 'id'

        },

        onUpdate: 'CASCADE',

        onDelete: 'SET NULL'

      }

    );

    // Create index
    await queryInterface.addIndex(

      'transactions',

      ['transferId'],

      {

        name: 'transactions_transferId_idx'

      }

    );

  },

  async down(queryInterface) {

    // Remove index first
    await queryInterface.removeIndex(

      'transactions',

      'transactions_transferId_idx'

    );

    // Remove column
    await queryInterface.removeColumn(

      'transactions',

      'transferId'

    );

  }

};