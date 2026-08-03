// services/treasury/postFXAccounting.js

const { LedgerAccount } = require('../../models');

async function postFXAccounting({

    sourceCurrency,
    destinationCurrency,

    sourceAmount,
    destinationAmount,

    marketRate,
    appliedRate,

    transaction

}) {

    // ======================================
    // NO FX FOR SAME CURRENCY
    // ======================================

    if (sourceCurrency === destinationCurrency) {

        return {

            fxResult: 0,

            marketRate,

            appliedRate

        };

    }

    // ======================================
    // CALCULATE MARKET VALUE
    // ======================================

    const marketDestinationAmount =

        Number(sourceAmount) *

        Number(marketRate);

    const fxResult =

        Number(destinationAmount) -

        marketDestinationAmount;

    console.log(

        '[FX RESULT]',

        fxResult

    );

    // ======================================
    // FX GAIN
    // ======================================

    if (fxResult > 0) {

        const fxGain = await LedgerAccount.findOne({

            where: {

                accountType: 'FX_GAIN'

            },

            transaction

        });

        if (!fxGain)

            throw new Error('FX_GAIN ledger missing');

        fxGain.balance =

            Number(fxGain.balance) +

            fxResult;

        await fxGain.save({

            transaction

        });

        console.log(

            '[FX GAIN POSTED]',

            fxResult

        );

    }

    // ======================================
    // FX LOSS
    // ======================================

    if (fxResult < 0) {

        const fxLoss = await LedgerAccount.findOne({

            where: {

                accountType: 'FX_LOSS'

            },

            transaction

        });

        if (!fxLoss)

            throw new Error('FX_LOSS ledger missing');

        fxLoss.balance =

            Number(fxLoss.balance) +

            Math.abs(fxResult);

        await fxLoss.save({

            transaction

        });

        console.log(

            '[FX LOSS POSTED]',

            Math.abs(fxResult)

        );

    }

    return {

        fxResult,

        marketRate,

        appliedRate

    };

}

module.exports = {

    postFXAccounting

};












// // services/treasury/postFXAccounting.js

// const { LedgerAccount } =
//     require('../../models');

// async function postFXAccounting({

//     sourceCurrency,
//     destinationCurrency,

//     sourceAmount,
//     destinationAmount,

//     marketRate,
//     appliedRate,

//     transaction

// }) {

//     // =================================
//     // TREASURY ACCOUNTS
//     // =================================

//     const treasurySource =
//         await LedgerAccount.findOne({

//             where: {
//                 accountType: 'TREASURY',
//                 currency: sourceCurrency
//             },

//             transaction

//         });

//     const treasuryDestination =
//         await LedgerAccount.findOne({

//             where: {
//                 accountType: 'TREASURY',
//                 currency: destinationCurrency
//             },

//             transaction

//         });

//     if (!treasurySource)
//         throw new Error(
//             `Treasury ${sourceCurrency} missing`
//         );

//     if (!treasuryDestination)
//         throw new Error(
//             `Treasury ${destinationCurrency} missing`
//         );

//     // =================================
//     // MOVE TREASURY
//     // =================================

//     treasurySource.balance =
//         Number(treasurySource.balance)
//         + Number(sourceAmount);

//     treasuryDestination.balance =
//         Number(treasuryDestination.balance)
//         - Number(destinationAmount);

//     await treasurySource.save({
//         transaction
//     });

//     await treasuryDestination.save({
//         transaction
//     });

//     // =================================
//     // FX GAIN / LOSS
//     // =================================

//     const marketDestinationAmount =
//         Number(sourceAmount)
//         * Number(marketRate);

//     const fxResult =
//         Number(destinationAmount)
//         - Number(marketDestinationAmount);

//     console.log(
//         '[FX RESULT]',
//         fxResult
//     );

//     // =================================
//     // PROFIT
//     // =================================

//     if (fxResult > 0) {

//         const fxGain =
//             await LedgerAccount.findOne({

//                 where: {
//                     accountType: 'FX_GAIN'
//                 },

//                 transaction

//             });

//         if (!fxGain)
//             throw new Error(
//                 'FX_GAIN ledger missing'
//             );

//         fxGain.balance =
//             Number(fxGain.balance)
//             + fxResult;

//         await fxGain.save({
//             transaction
//         });

//         console.log(
//             '[FX GAIN POSTED]',
//             fxResult
//         );
//     }

//     // =================================
//     // LOSS
//     // =================================

//     if (fxResult < 0) {

//         const fxLoss =
//             await LedgerAccount.findOne({

//                 where: {
//                     accountType: 'FX_LOSS'
//                 },

//                 transaction

//             });

//         if (!fxLoss)
//             throw new Error(
//                 'FX_LOSS ledger missing'
//             );

//         fxLoss.balance =
//             Number(fxLoss.balance)
//             + Math.abs(fxResult);

//         await fxLoss.save({
//             transaction
//         });

//         console.log(
//             '[FX LOSS POSTED]',
//             fxResult
//         );
//     }

//     return true;
// }

// module.exports = {
//     postFXAccounting
// };