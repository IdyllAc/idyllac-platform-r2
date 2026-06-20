'use strict';

module.exports = {
  async up(queryInterface) {

    await queryInterface.removeIndex(
      'ledger_event_stream',
      'ledger_event_stream_idempotency_unique'
    ).catch(() => {});

  },

  async down(queryInterface) {

    await queryInterface.addIndex(
      'ledger_event_stream',
      ['idempotencyKey'],
      {
        name: 'ledger_event_stream_idempotency_unique',
        unique: true
      }
    );

  }
};