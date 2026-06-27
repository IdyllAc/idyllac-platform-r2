// routes/admin.js
const express = require('express');
const router = express.Router();
const { Beneficiary } = require('../models');

const combinedAuth = require('../middleware/combinedAuth');
const replayLedgerEvents = require('../services/ledger/replayEngine');
const { verifyDoubleEntry } = require('../services/ledger/doubleEntryVerifier');
const { runLedgerReconciliation } = require('../services/ledger/reconciliationEngine');
const { runSelfHealing } = require('../services/ledger/selfHealingEngine');
const { retryFailedEvents } = require('../services/ledger/deadLetterQueue');
const { sequelize } = require('../models');
  

const adminOnly = require('../middleware/adminOnly');
const adminReviewController = require('../controllers/adminReviewController');
const adminPreviewController = require('../controllers/adminPreviewController');
const { runLedgerHealthCheck } = require('../controllers/ledgerAdminController');


// PAGE
router.get('/reviews', adminOnly, adminReviewController.getReviewsPage);

// PREVIEW (FINAL SYSTEM)
router.get('/preview/:userId', adminOnly, adminPreviewController.getPreviewUrls);

// APPROVE / REJECT
router.post('/documents/:userId/approve', adminOnly, adminReviewController.approveDocuments);
router.post('/documents/:userId/reject', adminOnly, adminReviewController.rejectDocuments);

// DEBUG
router.get('/debug', (req, res) => res.json(req.user));

// REPLAY
router.post('/replay-ledger', adminOnly, async (req, res) => {
  
      try {
  
        const result = await replayLedgerEvents({
            sequelize
          });
  
        return res.json(result);
  
      } catch (err) {
  
        console.error(err);
  
        return res.status(500).json({
          error: err.message
        });
  
      }
  
    }
  );



  // FULL REBUILD OF PROJECTIONS (DANGEROUS - USE WITH CAUTION)
  router.post('/rebuild-projections', adminOnly, async (req, res) => {

    try {
  
      const result = await replayLedgerEvents.rebuildProjectionsFromScratch({
        sequelize
      });
  
      return res.json(result);
  
    } catch (err) {
  
      console.error(err);
  
      return res.status(500).json({
        error: err.message
      });
    }
  });



  // AUDIT LEDGER SYSTEM
router.get('/audit-ledger', adminOnly, async (req, res) => {

  try {

    const audit = await runLedgerAudit({
      aggregateId: req.query.aggregateId || null
    });

    return res.json(audit);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
});



// VERIFY DOUBLE ENTRY FOR A TRANSFER
router.get('/verify-transfer/:id', adminOnly, async (req, res) => {

  try {

    const result = await verifyDoubleEntry({
      transferId: req.params.id
    });

    return res.json(result);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
});


// VERIFY DOUBLE ENTRY (OPTIONAL TRANSFER ID)
router.get(
  '/verify-double-entry',
  adminOnly,
  async (req, res) => {

    try {

      const result =
        await verifyDoubleEntry({
          transferId:
            req.query.transferId || null
        });

      return res.json(result);

    } catch (err) {

      console.error(err);

      return res.status(500).json({
        error: err.message
      });
    }
  }
);




router.get('/reconcile-ledger', adminOnly, async (req, res) => {
  try {

    const result = await runLedgerReconciliation({
      aggregateId: req.query.aggregateId || null
    });

    return res.json(result);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
});




router.post('/ledger/self-heal',  combinedAuth, adminOnly, async (req, res) => {

  console.log('SELF HEAL ROUTE HIT');

  try {

    const result = await runSelfHealing({
      sequelize,
      // aggregateId: req.body.aggregateId || null
      aggregateId:
        req.body && req.body.aggregateId
          ? req.body.aggregateId
          : null
    });

    return res.json(result);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
});




router.get('/replay-jobs', adminOnly, async (req, res) => {
  const { ReplayJob } = require('../models');

  const jobs = await ReplayJob.findAll({
    order: [['createdAt', 'DESC']]
  });

  res.json(jobs);
});




router.get('/ledger/events', adminOnly, async (req, res) => {

  const { LedgerEventStream } = require('../models');

  const events = await LedgerEventStream.findAll({
    order: [['id', 'DESC']],
    limit: 100
  });

  res.json(events);
});




router.post('/ledger/retry-failed', adminOnly, async (req, res) => {

  const result = await retryFailedEvents({
    sequelize
  });

  res.json(result);
});



// FULL SYSTEM CHECK
router.post('/ledger/health-check', adminOnly, runLedgerHealthCheck);



router.post('/beneficiaries/:id/verify', combinedAuth, adminOnly, async(req,res)=>{
  
  const beneficiary =
  await Beneficiary.findByPk(
  req.params.id
  );
  
  if(!beneficiary){
  
  return res.status(404).json({
  
  error:'Beneficiary not found'
  
  });
  
  }
  
  beneficiary.isVerified = true;
  
  beneficiary.status = 'ACTIVE';
  
  await beneficiary.save();
  
  res.json({
  
  success:true,
  beneficiary
  
  });
  
  });



  router.post('/beneficiaries/:id/block', combinedAuth, adminOnly, async(req,res)=>{
    
    const beneficiary =
    await Beneficiary.findByPk(
    req.params.id
    );
    
    if(!beneficiary){
    
    return res.status(404).json({
    
    error:'Beneficiary not found'
    
    });
    
    }
    
    beneficiary.status = 'BLOCKED';
    
    await beneficiary.save();
    
    res.json({
    
    success:true
    
    });
    
    });



module.exports = router;