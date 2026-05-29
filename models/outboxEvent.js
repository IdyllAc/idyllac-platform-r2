// models/outboxEvent.js

module.exports = (sequelize, DataTypes) => {

    const OutboxEvent = sequelize.define('OutboxEvent', {
  
      eventType: DataTypes.STRING,
      aggregateId: DataTypes.INTEGER,
  
      payload: DataTypes.JSONB,
  
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
      }
  
    }, {
      tableName: 'outbox_events'
    });
  
    return OutboxEvent;
  };