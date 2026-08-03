// services/cards/createCardLedgerEvent.js

const {
    appendLedgerEvent
} = require('../ledger/eventAppender');

async function createCardLedgerEvent({

    transaction,

    card,

    eventType,

    payload = {}

}) {

    return appendLedgerEvent({

        transaction,

        userId: card.userId,

        aggregateId: card.id,

        aggregateType: 'CARD',

        eventType,

     // reference: `CARD-${card.id}`,
        reference: `CARD-${card.id}-${eventType}`,

        payload: {

            cardId: card.id,

            bankAccountId: card.bankAccountId,

            status: card.status,

            frozen: card.isFrozen,

            ...payload

        },

        idempotencyKey:

            `card-${card.id}-${eventType}`

    });

}

module.exports = createCardLedgerEvent;