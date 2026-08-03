// services/cards/closeCard.js

const freezeCard =
    require('./freezeCard');

async function closeCard({

    card,

    transaction

}) {

    if (card.status === 'CLOSED') {

        throw new Error(
            'Card is already closed.'
        );

    }

    /*
    ------------------------------------
    Freeze first if still active
    ------------------------------------
    */

    if (

        card.status === 'ACTIVE' &&

        !card.isFrozen

    ) {

        await freezeCard({

            card,

            transaction

        });

    }

    await card.update({

        status: 'CLOSED',

        isFrozen: true,

        closedAt: new Date()

    }, {

        transaction

    });

    return card;

}

module.exports = closeCard;