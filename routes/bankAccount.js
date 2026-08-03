// routes/bankAccount.js

const express = require('express');
const router = express.Router();

const combinedAuth = require('../middleware/combinedAuth');

const bankAccountController = require('../controllers/bankAccountController');


// LIST ALL USER ACCOUNTS
router.get('/', combinedAuth, bankAccountController.getAccounts);


 // GET ONE ACCOUNT
 router.get('/:id', combinedAuth, bankAccountController.getAccount);


// CREATE ACCOUNT
router.post('/', combinedAuth, bankAccountController.createAccount);


// UPDATE ACCOUNT
router.patch('/:id', combinedAuth, bankAccountController.updateAccount);


// FREEZE
router.post('/:id/freeze', combinedAuth, bankAccountController.freezeAccount);


// UNFREEZE
router.post('/:id/unfreeze', combinedAuth, bankAccountController.unfreezeAccount);


// CLOSE
router.post('/:id/close', combinedAuth, bankAccountController.closeAccount);


// SET PRIMARY
router.post('/:id/primary', combinedAuth, bankAccountController.setPrimaryAccount);


module.exports = router;