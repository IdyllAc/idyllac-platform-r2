'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('replay_jobs', {

      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },

      status: {
        type: Sequelize.ENUM(
          'RUNNING',
          'COMPLETED',
          'FAILED'
        ),
        allowNull: false
      },

      aggregateId: {
        type: Sequelize.BIGINT,
        allowNull: true
      },

      cursorId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: 0
      },

      totalEvents: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      processedEvents: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      startedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      finishedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },

      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

    });

    await queryInterface.addIndex(
      'replay_jobs',
      ['status']
    );

    await queryInterface.addIndex(
      'replay_jobs',
      ['aggregateId']
    );
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('replay_jobs');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_replay_jobs_status";'
    );
  }

};