// routes/transfers.js
const express = require('express');
const router = express.Router();

const combinedAuth = require('../middleware/combinedAuth');
const idempotency = require('../middleware/idempotency');

const transferController = require('../controllers/transferController');



// TRANSFER CREATION
router.post('/create', combinedAuth, idempotency, transferController.requestTransfer);

// TRANSFER LIST
router.get('/', combinedAuth, transferController.listTransfers);

// RUN DAILY RECONCILIATION
router.get('/reconcile', combinedAuth, transferController.reconcileTransfers);

// REBUILD HISTORICAL ACCOUNTING
router.post('/rebuild-ledger/:id', combinedAuth, transferController.rebuildTransferLedger);

// TRANSFER GET
router.get('/:id', combinedAuth, transferController.getTransfer);


// TRANSFER AUTHORIZE
router.post('/authorize/:id', combinedAuth, transferController.authorizeTransfer);
  

// TRANSFER PROCESSING
router.post('/process/:id', combinedAuth, transferController.processTransfer);

  
// TRANSFER SETTLE
router.post('/settle/:id', combinedAuth, idempotency, transferController.settleTransfer);


// TRANSFER COPMLETE
router.post('/complete/:id', combinedAuth, transferController.completeTransfer);


// TRANSFER REVERSE
router.post('/reverse/:id', combinedAuth, idempotency, transferController.reverseTransfer);


// TRANSFER CANCEL
router.post('/cancel/:id', combinedAuth, transferController.cancelTransfer);


  module.exports = router;








  


 