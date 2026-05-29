'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('beneficiaries', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      bankAccountId: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: 'bank_accounts',
          key: 'id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      beneficiaryName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      iban: {
        type: Sequelize.STRING,
        allowNull: false
      },

      bic: {
        type: Sequelize.STRING,
        allowNull: false
      },

      bankName: {
        type: Sequelize.STRING,
        allowNull: true
      },

      country: {
        type: Sequelize.STRING,
        defaultValue: 'FR'
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: 'EUR'
      },

      transferNetwork: {
        type: Sequelize.STRING,
        defaultValue: 'SEPA'
      },

      status: {
        type: Sequelize.ENUM(
          'ACTIVE',
          'BLOCKED',
          'PENDING'
        ),
        defaultValue: 'ACTIVE'
      },

      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      isFavorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      lastUsedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('beneficiaries');

  }

};