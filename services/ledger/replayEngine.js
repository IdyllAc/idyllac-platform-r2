// services/ledger/replayEngine.js
const { LedgerEventStream } = require('../../models');
const { projectLedgerEvent } = require('./projectionEngine');
const { Op } = require('sequelize');

  
  async function replayLedgerEvents({
    sequelize,
    aggregateId = null
  }) {


  
    const where = {
      projectionStatus: {
        [Op.in]: ['PENDING', 'FAILED']
      }
    };
  
    if (aggregateId) {
      where.aggregateId = aggregateId;
    }
  
    const events =
      await LedgerEventStream.findAll({
        where,
        order: [['createdAt', 'ASC']],
      });
  

    let processed = 0;
  
    for (const event of events) {
  
      const t =
        await sequelize.transaction();
  
      try {
  
        await projectLedgerEvent({
          sequelize,
          transaction: t,
          event
        });
  
        await event.update({
  
          projectionStatus:
            'PROJECTED',
  
          projectedAt:
            new Date()
  
        }, {
          transaction: t
        });
  
        await t.commit();
  
        processed++;
  
      } catch (err) {
  
        await t.rollback();
  
        await event.update({
          projectionStatus: 'FAILED'
        });
  
        console.error(
          'REPLAY FAILED:',
          event.id,
          err.message
        );
      }
    }
  
    return {
      processed
    };
  }
  
  module.exports = {
    replayLedgerEvents
  };