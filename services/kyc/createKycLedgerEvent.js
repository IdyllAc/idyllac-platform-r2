// services/kyc/createKycLedgerEvent.js

const {

    appendLedgerEvent

} = require('../ledger/eventAppender');

async function createKycLedgerEvent({

    transaction,

    kyc,

    eventType

}) {

    return appendLedgerEvent({

        transaction,

        aggregateId: kyc.id,

        aggregateType: 'KYC',

        eventType,

        reference: `KYC-${kyc.id}`,

        userId: kyc.userId,

        payload: {

            kycId: kyc.id,

            userId: kyc.userId,

            status: kyc.status,

            riskScore: kyc.riskScore

        },

        idempotencyKey:

            `kyc-${kyc.id}-${eventType.toLowerCase()}`

    });

}

module.exports = createKycLedgerEvent;