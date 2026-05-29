// routes/card.js

const express = require('express');
const router = express.Router();
const combinedAuth = require('../middleware/combinedAuth');
const { Card, BankAccount, Transaction } = require('../models');
const {

  generateCardNumber,

  generateMaskedNumber,

  generateIBAN,

  generateBIC,

  generateExpiry,

  generateCVV

} = require('../utils/cardGenerator');


// GET USER CARDS
router.get('/', combinedAuth, async (req, res) => {

  try {

    const cards = await Card.findAll({
      where: {
        userId: req.user.id
      }
    });

    res.json(cards);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// CREATE CARD
router.post('/create', combinedAuth, async (req, res) => {

  try {

    // =========================
    // CREATE BANK ACCOUNT FIRST
    // =========================

    const bankAccount = await BankAccount.findOne({

      where: {
        userId: req.user.id
      }

    });

    if (!bankAccount) {

      return res.status(404).json({
        error: 'Bank account not found'
      });

    }
    
    
    // =========================
    // CARD DATA
    // =========================

    const number = generateCardNumber();

    const expiry = generateExpiry();

    // =========================
    // CREATE CARD
    // =========================

    const card = await Card.create({

      userId: req.user.id,

      bankAccountId: bankAccount.id,

      cardHolderName: req.user.name,

      number,

      maskedNumber:
        generateMaskedNumber(number),

      last4:
        number.replace(/\s/g, '').slice(-4),

      expiryMonth:
        expiry.month,

      expiryYear:
        expiry.year,

      cvv:
        generateCVV(),

      iban:
       generateIBAN(),

      bic:
       generateBIC()

    });

    await Transaction.create({

      bankAccountId: bankAccount.id,

      cardId: card.id,

      reference: 'TRX-' + Date.now(),

      type: 'DEPOSIT',

      direction: 'CREDIT',

      amount: 1000,

      currency: 'EUR',

      description: 'Initial funding',

      status: 'COMPLETED',

      balanceBefore: 0,

      balanceAfter: 1000

    });

    res.json({

      success: true,

      bankAccount,

      card

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error: err.message

    });

  }

});

module.exports = router;