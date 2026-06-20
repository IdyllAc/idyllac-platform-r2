// controllers/ledgerAdminController.js

const { replayLedgerEvents } = require('../services/ledger/replayEngine');
const { runLedgerAudit } = require('../services/ledger/auditEngine');
const { verifyDoubleEntry } = require('../services/ledger/doubleEntryVerifier');
const { sequelize } = require('../models');

/**
 * FULL SYSTEM CHECK ENDPOINT
 */
async function runLedgerHealthCheck(req, res) {

  try {

    const replay = await replayLedgerEvents({
      sequelize
    });

    const audit = await runLedgerAudit();

    const verification = await verifyDoubleEntry({});

    return res.json({
      replay,
      audit,
      verification
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });
  }
}

module.exports = {
  runLedgerHealthCheck
};