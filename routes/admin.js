// routes/admin.js
const express = require('express');
const router = express.Router();

const combinedAuth = require('../middleware/combinedAuth');
const replayLedgerEvents = require('../services/ledger/replayEngine');
const { sequelize } = require('../models');
  

const adminOnly = require('../middleware/adminOnly');
const adminReviewController = require('../controllers/adminReviewController');
const adminPreviewController = require('../controllers/adminPreviewController');

// PAGE
router.get('/reviews', adminOnly, adminReviewController.getReviewsPage);

// PREVIEW (FINAL SYSTEM)
router.get('/preview/:userId', adminOnly, adminPreviewController.getPreviewUrls);

// APPROVE / REJECT
router.post('/documents/:userId/approve', adminOnly, adminReviewController.approveDocuments);
router.post('/documents/:userId/reject', adminOnly, adminReviewController.rejectDocuments);

// DEBUG
router.get('/debug', (req, res) => res.json(req.user));

// 
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

module.exports = router;