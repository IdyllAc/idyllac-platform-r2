'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(

      'cards',

      'bankAccountId',

      {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: 'bank_accounts',
          key: 'id'
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }

    );

    await queryInterface.removeColumn(
      'cards',
      'balance'
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.addColumn(

      'cards',

      'balance',

      {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      }

    );

    await queryInterface.removeColumn(
      'cards',
      'bankAccountId'
    );

  }

};