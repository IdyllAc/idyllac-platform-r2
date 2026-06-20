module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.changeColumn(
      'ledger_event_stream',
      'projectionStatus',
      {
        type: Sequelize.ENUM('PENDING', 'PROJECTED', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING'
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.changeColumn(
      'ledger_event_stream',
      'projectionStatus',
      {
        type: Sequelize.STRING(30)
      }
    );

  }
};