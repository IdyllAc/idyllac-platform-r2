// services/ledger/replayJobController.js
const { ReplayJob } = require('../../models');

/**
 * CREATE JOB
 */
async function createReplayJob({
  sequelize,
  aggregateId = null
}) {

  return await ReplayJob.create({
    status: 'RUNNING',
    startedAt: new Date(),
    aggregateId,
    cursorId: 0,
    totalEvents: 0,
    processedEvents: 0
  });
}

/**
 * UPDATE PROGRESS (SAFE BATCH UPDATE)
 */
async function updateJobProgress({
  job,
  processedEvents,
  cursorId
}) {

  await job.update({
    processedEvents,
    cursorId
  });
}

/**
 * COMPLETE JOB
 */
async function completeJob(job) {

  await job.update({
    status: 'COMPLETED',
    finishedAt: new Date()
  });
}

/**
 * FAIL JOB
 */
async function failJob(job, err) {

  await job.update({
    status: 'FAILED',
    finishedAt: new Date(),
    errorMessage: err.message
  });
}

module.exports = {
  createReplayJob,
  updateJobProgress,
  completeJob,
  failJob
};