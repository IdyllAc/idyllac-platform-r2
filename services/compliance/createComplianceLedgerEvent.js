// services/compliance/createComplianceLedgerEvent.js

const {

    appendLedgerEvent

} = require('../ledger/eventAppender');

async function createComplianceLedgerEvent({

    transaction,

    account,

    eventType

}) {

    return appendLedgerEvent({

        transaction,

        userId: account.userId,

        aggregateId: account.id,

        aggregateType: 'COMPLIANCE',

        eventType,

        reference:
            `COMPLIANCE-${account.id}`,

        payload: {

            accountId: account.id,

            userId: account.userId,

            frozen: account.isFrozen

        },

        idempotencyKey:
            `compliance-${account.id}-${eventType.toLowerCase()}`

    });

}

module.exports = createComplianceLedgerEvent;