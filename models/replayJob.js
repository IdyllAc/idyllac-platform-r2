// models/replayJob.js

'use strict';

module.exports = (sequelize, DataTypes) => {

  const ReplayJob = sequelize.define('ReplayJob', {

    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    status: {
      type: DataTypes.ENUM(
        'RUNNING',
        'COMPLETED',
        'FAILED'
      ),
      allowNull: false
    },

    aggregateId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },

    cursorId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },

    totalEvents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    processedEvents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    startedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
        }

  }, {

    tableName: 'replay_jobs',

    timestamps: true

  });

  return ReplayJob;
};