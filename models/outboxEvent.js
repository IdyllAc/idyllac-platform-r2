// models/outboxEvent.js
module.exports = (sequelize, DataTypes) => {
    const OutboxEvent = sequelize.define('OutboxEvent', {

      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      eventType: {
        type: DataTypes.STRING,
        allowNull: false
      },

      aggregateId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      payload: {
        type: DataTypes.JSONB,
        allowNull: false
      },

      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'PROCESSING',
          'COMPLETED',
          'FAILED',
          'DEAD_LETTER'
        ),
        defaultValue: 'PENDING'
      },

      retryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }

    });

    return OutboxEvent;

  }    

  

