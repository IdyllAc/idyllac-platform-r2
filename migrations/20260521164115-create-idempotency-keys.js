'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('idempotency_keys', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      endpoint: {
        type: Sequelize.STRING,
        allowNull: false
      },

      method: {
        type: Sequelize.STRING,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM(
          'PROCESSING',
          'COMPLETED',
          'FAILED'
        ),
        defaultValue: 'PROCESSING'
      },

      response: {
        type: Sequelize.JSONB,
        allowNull: true
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

  async down(queryInterface) {

    await queryInterface.dropTable(
      'idempotency_keys'
    );

  }

};