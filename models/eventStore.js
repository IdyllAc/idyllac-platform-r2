// models/eventStore.js
module.exports = (sequelize, DataTypes) => {

    const EventStore = sequelize.define('EventStore', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      aggregateId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      aggregateType: {
        type: DataTypes.STRING,
        defaultValue: 'TRANSFER'
      },
  
      eventType: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      payload: {
        type: DataTypes.JSONB,
        allowNull: false
      },
  
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true
      }
  
    }, {
  
      tableName: 'eventStore'
  
    });
  
    return EventStore;
  
  };