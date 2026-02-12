'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'users', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
      },

      passport_key: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      id_card_key: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      license_key: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },      
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('documents');
  }
};
