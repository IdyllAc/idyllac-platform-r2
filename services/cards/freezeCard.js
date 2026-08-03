// services/cards/freezeCard.js

async function freezeCard({

    card,

    transaction

}) {

    if (card.status !== 'ACTIVE') {

        throw new Error(
            'Only ACTIVE cards can be frozen.'
        );

    }

    if (card.isFrozen) {

        throw new Error(
            'Card is already frozen.'
        );

    }

    await card.update({

        status: 'BLOCKED',

        isFrozen: true,

        blockedAt: new Date()

    }, {

        transaction

    });

    return card;

}

module.exports = freezeCard;