// services/treasury/treasuryService.js

const { LedgerAccount } = require('../../models');

async function getTreasuryAccount(currency, transaction = null) {

  const treasury = await LedgerAccount.findOne({

    where: {
      accountType: 'TREASURY',
      currency
    },

    transaction
  });

  if (!treasury) {
    throw new Error(
      `Treasury account not found for ${currency}`
    );
  }

  return treasury;
}

module.exports = {
  getTreasuryAccount
};
