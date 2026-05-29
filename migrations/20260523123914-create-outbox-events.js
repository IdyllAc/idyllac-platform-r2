'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('outbox_events', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      eventType: {
        type: Sequelize.STRING,
        allowNull: false
      },

      aggregateId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      payload: {
        type: Sequelize.JSONB,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'PROCESSED',
          'FAILED'
        ),
        defaultValue: 'PENDING'
      },

      retryCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('outbox_events');
  }
};
