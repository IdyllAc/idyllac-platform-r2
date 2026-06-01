// 🚀 models/ledgerEventStream.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const LedgerEventStream = sequelize.define('LedgerEventStream', {

    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    // =========================
    // EVENT IDENTIFIER
    // =========================
    aggregateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },

    aggregateType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'TRANSFER',
      index: true,
    },

    // =========================
    // EVENT CORE
    // =========================
    eventType: {
      type: DataTypes.ENUM(
        'TRANSFER_CREATED',
        'TRANSFER_AUTHORIZED',
        'TRANSFER_PROCESSING',
        'TRANSFER_SETTLED',
        'TRANSFER_COMPLETED',
        'TRANSFER_REVERSED',
        'TRANSFER_FAILED'
      ),
      allowNull: false,
      index: true,
    },

    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },

    // =========================
    // EVENT PAYLOAD (FLEXIBLE)
    // =========================
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },

    // =========================
    // IDEMPOTENCY SUPPORT
    // =========================
    idempotencyKey: {
      type: DataTypes.STRING(120),
      allowNull: true,
      index: true,
    },

    // =========================
    // STATUS / TRACEABILITY
    // =========================
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'PUBLISHED',
      index: true,
    },

    // =========================
    // METADATA
    // =========================
    source: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'API',
    },

    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    projectionStatus: {
      type: DataTypes.ENUM(
        'PENDING',
        'PROJECTED',
        'FAILED'
      ),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    
    projectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: 'ledger_event_stream',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false, // events are immutable
    indexes: [

      {
        fields: ['aggregateId']
      },

      {
        fields: ['eventType']
      },

      {
        fields: ['userId']
      },

      {
        fields: ['reference'],
        unique: true
      },

      {
        fields: ['idempotencyKey']
      }

    ]
  });

  return LedgerEventStream;
};