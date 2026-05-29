'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

    // =========================
    // ADD userId
    // =========================

    await queryInterface.addColumn(
      'idempotency_keys',
      'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    );

    // =========================
    // REMOVE OLD UNIQUE
    // =========================

    await queryInterface.removeConstraint(
      'idempotency_keys',
      'idempotency_keys_key_key'
    );

    // =========================
    // CREATE NEW COMPOSITE UNIQUE
    // =========================

    await queryInterface.addConstraint(
      'idempotency_keys',
      {
        fields: [
          'userId',
          'key',
          'endpoint',
          'method'
        ],

        type: 'unique',

        name:
          'unique_idempotency_request'
      }
    );

  },

  async down(queryInterface, Sequelize) {

    // =========================
    // REMOVE COMPOSITE UNIQUE
    // =========================

    await queryInterface.removeConstraint(
      'idempotency_keys',
      'unique_idempotency_request'
    );

    // =========================
    // RESTORE OLD UNIQUE
    // =========================

    await queryInterface.addConstraint(
      'idempotency_keys',
      {
        fields: ['key'],

        type: 'unique',

        name:
          'idempotency_keys_key_key'
      }
    );

    // =========================
    // REMOVE userId
    // =========================

    await queryInterface.removeColumn(
      'idempotency_keys',
      'userId'
    );

  }

};
