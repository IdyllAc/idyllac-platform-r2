'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('cards', {

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

      cardHolderName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      maskedNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },

      last4: {
        type: Sequelize.STRING(4),
        allowNull: false
      },

      expiryMonth: {
        type: Sequelize.STRING(2),
        allowNull: false
      },

      expiryYear: {
        type: Sequelize.STRING(4),
        allowNull: false
      },

      cvv: {
        type: Sequelize.STRING,
        allowNull: false
      },

      iban: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      bic: {
        type: Sequelize.STRING,
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: 'EUR'
      },

      balance: {
        type: Sequelize.DECIMAL(12,2),
        defaultValue: 0
      },

      type: {
        type: Sequelize.STRING,
        defaultValue: 'VISA'
      },

      level: {
        type: Sequelize.STRING,
        defaultValue: 'CLASSIC'
      },

      physical: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      virtual: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      status: {
        type: Sequelize.ENUM(
          'active',
          'blocked',
          'expired',
          'pending'
        ),
        defaultValue: 'active'
      },

      isFrozen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      dailyLimit: {
        type: Sequelize.DECIMAL(12,2),
        defaultValue: 5000
      },

      contactlessEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      activatedAt: {
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

    await queryInterface.dropTable('cards');

  }

};