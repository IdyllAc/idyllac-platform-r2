// services/fees/feeEngine.js

const { LedgerAccount } =
    require('../../models');

async function distributeFees({

    transfer,

    transaction

}) {

    const fee =
        Number(transfer.feeAmount || 0);

    if (fee <= 0)
        return true;

    // ====================================
    // CONFIGURATION
    // ====================================

    const bankRevenue =
        fee * 0.80;

    const treasuryReserve =
        fee * 0.10;

    const correspondentReserve =
        fee * 0.10;

    // ====================================
    // SYSTEM FEES ACCOUNT
    // ====================================

    const feeAccount =
        await LedgerAccount.findOne({

            where: {
                accountType:
                    'SYSTEM_FEES'
            },

            transaction

        });

    if (!feeAccount)
        throw new Error(
            'SYSTEM_FEES ledger missing'
        );

    feeAccount.balance =
        Number(feeAccount.balance)
        + bankRevenue;

    await feeAccount.save({
        transaction
    });

    // ====================================
    // TREASURY ACCOUNT
    // ====================================

    const treasury =
        await LedgerAccount.findOne({

            where: {
                accountType:
                    'TREASURY',

                currency:
                    transfer.sourceCurrency
            },

            transaction

        });

    if (treasury) {

        treasury.balance =
            Number(treasury.balance)
            + treasuryReserve;

        await treasury.save({
            transaction
        });

    }

    console.log(
        '[FEE DISTRIBUTION]',
        {

            totalFee: fee,

            bankRevenue,

            treasuryReserve,

            correspondentReserve

        }
    );

    return true;
}

module.exports = {
    distributeFees
};