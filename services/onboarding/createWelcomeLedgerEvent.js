// services/onboarding/createWelcomeLedgerEvent.js

const { appendLedgerEvent } = require('../ledger/eventAppender');

async function createWelcomeLedgerEvent({
    transaction,
    user,
    bankAccount,
    customerLedger
}) {
    return appendLedgerEvent({
        transaction,

        userId: user.id,

        aggregateId: user.id,
        aggregateType: 'CUSTOMER',

        eventType: 'CUSTOMER_CREATED',

        reference: `CUSTOMER-${user.id}`,

        payload: {
            userId: user.id,
            bankAccountId: bankAccount.id,
            ledgerAccountId: customerLedger.id,
            currency: bankAccount.currency
        },

        idempotencyKey: `customer-created-${user.id}`
    });
}

module.exports = {
    createWelcomeLedgerEvent
};