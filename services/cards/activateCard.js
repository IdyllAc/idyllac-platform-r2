// services/cards/activateCard.js

async function activateCard({

    card,

    transaction

}) {

    if (card.status !== 'GENERATED') {

        throw new Error(
            'Only GENERATED cards can be activated.'
        );

    }

    await card.update({

        status: 'ACTIVE',

        activatedAt: new Date()

    }, {

        transaction

    });

    return card;

}

module.exports = activateCard;