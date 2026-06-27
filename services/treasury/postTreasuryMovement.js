// services/treasury/postTreasuryMovement.js

const { LedgerAccount } = require('../../models');

async function postTreasuryMovement({
  sourceCurrency,
  destinationCurrency,
  sourceAmount,
  destinationAmount,
  transaction
}) {

  console.log(
    '[POST TREASURY MOVEMENT CALLED]',
    sourceCurrency,
    destinationCurrency,
    sourceAmount,
    destinationAmount
  );

  const treasurySource =
    await LedgerAccount.findOne({
      where: {
        accountType: 'TREASURY',
        currency: sourceCurrency
      },
      transaction
    });

  const treasuryDestination =
    await LedgerAccount.findOne({
      where: {
        accountType: 'TREASURY',
        currency: destinationCurrency
      },
      transaction
    });


    console.log(
      '[TREASURY SOURCE]',
      treasurySource?.id,
      treasurySource?.currency,
      treasurySource?.balance
    );
  
    console.log(
      '[TREASURY DESTINATION]',
      treasuryDestination?.id,
      treasuryDestination?.currency,
      treasuryDestination?.balance
    );


  if (!treasurySource)
    throw new Error(
      `Treasury ${sourceCurrency} missing`
    );

  if (!treasuryDestination)
    throw new Error(
      `Treasury ${destinationCurrency} missing`
    );

  treasurySource.balance =
    Number(treasurySource.balance)
    + Number(sourceAmount);

  treasuryDestination.balance =
    Number(treasuryDestination.balance)
    - Number(destinationAmount);

  await treasurySource.save({ transaction });

  await treasuryDestination.save({ transaction });

  return {
    treasurySource,
    treasuryDestination
  };
}

module.exports = {
  postTreasuryMovement
};