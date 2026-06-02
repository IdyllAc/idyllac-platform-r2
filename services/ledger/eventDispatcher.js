// services/ledger/eventDispatcher.js
const { projectLedgerEvent } = require('./projectionEngine');

async function dispatchLedgerEvent({
  sequelize,
  event,
  accounts
}) {

  // =========================
  // SAFE TRANSACTION WRAPPER
  // =========================
  const t = await sequelize.transaction();

  try {

    // =========================
    // PROJECTION STEP
    // =========================
    await projectLedgerEvent({
      sequelize,
      transaction: t,
      event,
      accounts
    });
    

    await t.commit();

    return {
      success: true,
      projected: true
    };

  } catch (err) {

    await t.rollback();

    console.error("PROJECTION FAILED:", err);

    throw err;
  }
}

module.exports = {
  dispatchLedgerEvent
};