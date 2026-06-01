'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(
      'ledger_event_stream',
      {

        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true
        },

        aggregateId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        aggregateType: {
          type: Sequelize.STRING(50),
          allowNull: false
        },

        eventType: {
          type: Sequelize.STRING(100),
          allowNull: false
        },

        reference: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true
        },

        userId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        payload: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: {}
        },

        idempotencyKey: {
          type: Sequelize.STRING(120)
        },

        status: {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: 'PUBLISHED'
        },

        projectionStatus: {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: 'PENDING'
        },

        projectedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },

        source: {
          type: Sequelize.STRING(50)
        },

        version: {
          type: Sequelize.INTEGER,
          defaultValue: 1
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        }

      }
    );

    await queryInterface.addIndex(
      'ledger_event_stream',
      ['aggregateId']
    );

    await queryInterface.addIndex(
      'ledger_event_stream',
      ['eventType']
    );

    await queryInterface.addIndex(
      'ledger_event_stream',
      ['userId']
    );

    await queryInterface.addIndex(
      'ledger_event_stream',
      ['projectionStatus']
    );
  },

  async down(queryInterface) {

    await queryInterface.dropTable(
      'ledger_event_stream'
    );

  }

};
