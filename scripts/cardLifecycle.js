// scripts/cardLifecycle.js

const { sequelize, User } = require('../models');

const {
    requestCard,
    approveCardRequest,
    generateCard,
    activateCard,
    freezeCard,
    unfreezeCard,
    replaceCard,
    closeCard,
    createCardLedgerEvent,
    createCardRequestLedgerEvent
} = require('../services/cards/cardService');

(async () => {

    const transaction = await sequelize.transaction();

    try {

        const USER_ID = 21;
        // const BANK_ACCOUNT_ID = 3;

        console.log('\n===== CARD LIFECYCLE =====\n');



        const user = await User.findByPk(

            USER_ID,
        
            {
        
                transaction
        
            }
        
        );
        
        if (!user) {
        
            throw new Error(
                'User not found.'
            );
        
        }


        //
        // REQUEST
        //

        let request = await requestCard({

            userId: user.id,

            cardHolderName: 'IDYLLAC',

            transaction

        });

        console.log('REQUESTED:', request.id);


        //
        // APPROVE
        //

        request = await approveCardRequest({

            request,

            transaction

        });

        console.log('APPROVED:', request.id);


        //
        // GENERATE
        //

     let card = await generateCard({

            request,

            transaction

        });

        console.log('GENERATED:', card.status);


        //
        // ACTIVATE
        //

        card = await activateCard({

            card,

            transaction

        });

        console.log('ACTIVATED:', card.status);

        await createCardLedgerEvent({

            transaction,

            card,

            eventType: 'CARD_ACTIVATED'

        });

        //
        // FREEZE
        //

        card = await freezeCard({

            card,

            transaction

        });

        console.log('FROZEN:', card.status);

        await createCardLedgerEvent({

            transaction,

            card,

            eventType: 'CARD_FROZEN'

        });

        //
        // UNFREEZE
        //

        card = await unfreezeCard({

            card,

            transaction

        });

        console.log('UNFROZEN:', card.status);

        await createCardLedgerEvent({

            transaction,

            card,

            eventType: 'CARD_UNFROZEN'

        });

        //
        // REPLACE
        //

        const replacement = await replaceCard({

            card,

            transaction

        });


        await createCardRequestLedgerEvent({

            transaction,
        
            request: replacement.request,
        
            eventType: 'CARD_REQUESTED'
        
        });
        
        await createCardRequestLedgerEvent({
        
            transaction,
        
            request: replacement.request,
        
            eventType: 'CARD_APPROVED'
        
        });


        console.log(
            'REPLACED:',
            replacement.oldCard.id,
            '->',
            replacement.newCard.id
        );

        await createCardLedgerEvent({

            transaction,

            card: replacement.oldCard,

            eventType: 'CARD_REPLACED'

        });

        //
        // CLOSE OLD CARD
        //

        await closeCard({

            card: replacement.oldCard,

            transaction

        });

        console.log(
            'CLOSED:',
            replacement.oldCard.id
        );

        await createCardLedgerEvent({

            transaction,

            card: replacement.oldCard,

            eventType: 'CARD_CLOSED'

        });

        await transaction.commit();

        console.log('\n✔ CARD LIFECYCLE PASSED\n');

    } catch (err) {

        await transaction.rollback();

        console.error(err);

    }

})();