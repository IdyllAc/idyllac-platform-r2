'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('event_store', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      aggregateId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      aggregateType: {
        type: Sequelize.STRING,
        defaultValue: 'TRANSFER'
      },

      eventType: {
        type: Sequelize.STRING,
        allowNull: false
      },

      payload: {
        type: Sequelize.JSONB,
        allowNull: false
      },

      metadata: {
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

    await queryInterface.dropTable('event_store');

  }

};