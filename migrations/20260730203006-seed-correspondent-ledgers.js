'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface) {

      const now = new Date();

      await queryInterface.bulkInsert('ledger_accounts', [

          {
              accountType: 'CORRESPONDENT',
              currency: 'EUR',
              balance: 0,
              createdAt: now,
              updatedAt: now
          },

          {
              accountType: 'CORRESPONDENT',
              currency: 'USD',
              balance: 0,
              createdAt: now,
              updatedAt: now
          },

          {
              accountType: 'CORRESPONDENT',
              currency: 'GBP',
              balance: 0,
              createdAt: now,
              updatedAt: now
          }

      ]);

  },

  async down(queryInterface) {

      await queryInterface.bulkDelete(

          'ledger_accounts',

          {
              accountType: 'CORRESPONDENT'
          }

      );

  }

};
