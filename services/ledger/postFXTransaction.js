// services/ledger/postFXTransaction.js

const { LedgerAccount, LedgerEntry } = require('../../models');

async function postFXTransaction({

    t,

    transferId,

    fromAccount,
    toAccount,

    sourceAmount,
    sourceCurrency,

    destinationAmount,
    destinationCurrency,

    exchangeRate,

    reference,
    description,

    rebuildMode = false

}) {

    // ------------------------------------
    // Lock accounts
    // ------------------------------------

    const sender = await LedgerAccount.findByPk(fromAccount.id, {
        transaction: t,
        lock: t.LOCK.UPDATE
    });

    const receiver = await LedgerAccount.findByPk(toAccount.id, {
        transaction: t,
        lock: t.LOCK.UPDATE
    });

    if (!sender || !receiver)
        throw new Error('Treasury ledger missing');

    // ------------------------------------
    // Balance check
    // ------------------------------------

    if (!rebuildMode) {

        if (Number(sender.balance) < Number(sourceAmount)) {
            throw new Error('Insufficient treasury balance');
        }

    }

    // ------------------------------------
    // Debit entry
    // ------------------------------------

    await LedgerEntry.create({

        ledgerAccountId: sender.id,

        transferId,

        type: 'DEBIT',

        amount: sourceAmount,
        currency: sourceCurrency,

        originalAmount: sourceAmount,
        originalCurrency: sourceCurrency,

        fxRate: exchangeRate,

        reference,
        description

    }, { transaction: t });

    // ------------------------------------
    // Credit entry
    // ------------------------------------

    await LedgerEntry.create({

        ledgerAccountId: receiver.id,

        transferId,

        type: 'CREDIT',

        amount: destinationAmount,
        currency: destinationCurrency,

        originalAmount: sourceAmount,
        originalCurrency: sourceCurrency,

        fxRate: exchangeRate,

        reference,
        description

    }, { transaction: t });

    return true;

}

module.exports = {

    postFXTransaction

};