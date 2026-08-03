// services/cards/createCardRequestLedgerEvent.js

const { appendLedgerEvent } = require('../ledger/eventAppender');

async function createCardRequestLedgerEvent({

    transaction,

    request,

    eventType,

    payload = {}

}) {

    return appendLedgerEvent({

        transaction,

        userId: request.userId,

        aggregateId: request.id,

        aggregateType: 'CARD_REQUEST',

        eventType,

        reference: `CARD-REQUEST-${request.id}-${eventType}`,

        payload: {

            requestId: request.id,

            bankAccountId: request.bankAccountId,

            cardHolderName: request.cardHolderName,

            currency: request.currency,

            type: request.type,

            level: request.level,

            physical: request.physical,

            virtual: request.virtual,

            status: request.status,

            ...payload

        },

        idempotencyKey:

            `card-request-${request.id}-${eventType}`

    });

}

module.exports = createCardRequestLedgerEvent;