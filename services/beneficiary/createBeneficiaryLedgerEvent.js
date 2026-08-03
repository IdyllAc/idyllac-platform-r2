// services/beneficiary/createBeneficiaryLedgerEvent.js

const {
    appendLedgerEvent
} = require('../ledger/eventAppender');

async function createBeneficiaryLedgerEvent({

    transaction,

    beneficiary,

    eventType

}) {

    return appendLedgerEvent({

        transaction,

        userId: beneficiary.userId,

        aggregateId: beneficiary.id,

        aggregateType: 'BENEFICIARY',

        eventType,

        reference:
            `BENEFICIARY-${beneficiary.id}`,

        payload: {

            beneficiaryId: beneficiary.id,

            beneficiaryName: beneficiary.beneficiaryName,

            iban: beneficiary.iban,

            bic: beneficiary.bic,

            currency: beneficiary.currency,

             status: beneficiary.status     // This later replaced by commented out lines below if I want to log the status change in the ledger event in better detail, I'd wait until we build a more generic event builder. It's an improvement for later.
            // previousStatus: 'VERIFIED',

            // newStatus: 'ACTIVE'


        },

        idempotencyKey:
            `beneficiary-${beneficiary.id}-${eventType.toLowerCase()}`

    });

}

module.exports = createBeneficiaryLedgerEvent;