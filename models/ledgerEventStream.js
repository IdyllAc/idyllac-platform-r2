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
    },

    aggregateType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'TRANSFER',
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
    },

    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      unique: true
    },

    // =========================
    // STATUS / TRACEABILITY
    // =========================
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'PUBLISHED',
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



    // projectionLocked: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false
    // },
    
    // processingSource: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },


    
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
        fields: ['reference']
      },

      // {
      //   fields: ['idempotencyKey']
      // }

    ]
  });

  return LedgerEventStream;
};