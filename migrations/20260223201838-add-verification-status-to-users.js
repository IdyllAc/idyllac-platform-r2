'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'verification_status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'verification_status');
  }
};