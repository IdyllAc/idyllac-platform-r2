// services/cards/unfreezeCard.js

async function unfreezeCard({

    card,

    transaction

}) {

    if (card.status !== 'BLOCKED') {

        throw new Error(
            'Only BLOCKED cards can be unfrozen.'
        );

    }

    if (!card.isFrozen) {

        throw new Error(
            'Card is not frozen.'
        );

    }

    await card.update({

        status: 'ACTIVE',

        isFrozen: false,

        blockedAt: null

    }, {

        transaction

    });

    return card;

}

module.exports = unfreezeCard;