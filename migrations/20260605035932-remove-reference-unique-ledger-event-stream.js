'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // remove UNIQUE index safely
    await queryInterface.removeIndex(
      'ledger_event_stream',
      'ledger_event_stream_reference_key'
    ).catch(() => {});

    // also remove duplicate if exists
    await queryInterface.removeIndex(
      'ledger_event_stream',
      'ledger_event_stream_reference'
    ).catch(() => {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.addIndex(
      'ledger_event_stream',
      ['reference'],
      {
        name: 'ledger_event_stream_reference_key',
        unique: true
      }
    );

  }
};