// services/settlement/replaySettlement.js

const { appendLedgerEvent } = require('../ledger/eventAppender');

const { distributeFees } = require('../fees/feeEngine');

const loadBeneficiary = require('../settlement/loadBeneficiary');
const creditBeneficiary = require('../settlement/creditBeneficiary');
const settlementLedgerInternal = require('../settlement/settlementLedgerInternal')
const settlementLedgerExternal = require('../settlement/settlementLedgerExternal');
const settlementTransactions = require('../settlement/settlementTransactions');
const loadSettlementLedgers = require('../settlement/loadSettlementLedgers');

const { postFXAccounting } = require('../treasury/postFXAccounting');
const { getTreasuryAccount } = require('../treasury/treasuryService');



async function replaySettlement({

    transfer,

    senderAccount,

    transaction,

    replayMode = false

}) {


    const {

        customerLedger,
        systemLedger

    } = await loadSettlementLedgers({

        transfer,
        transaction

    });



    const {

        beneficiary,
        beneficiaryAccount,
        beneficiaryLedger,
        isInternal

    } = await loadBeneficiary({

        transfer,

        transaction

    });



    let beneficiaryCredit;

    if (!replayMode) {

        beneficiaryCredit =
            await creditBeneficiary({

                beneficiaryAccount,

                transfer,

                transaction

            });

    } else {

        beneficiaryCredit =
            Number(transfer.amount) *
            Number(transfer.exchangeRate);

    }



    const requiresFX =
        transfer.sourceCurrency !==
        transfer.destinationCurrency;


    if (requiresFX) {

        const treasurySource =
            await getTreasuryAccount(
                transfer.sourceCurrency,
                transaction
            );

        const treasuryDestination =
            await getTreasuryAccount(
                transfer.destinationCurrency,
                transaction
            );

        console.log(
            '[TREASURY FX]',
            treasurySource.currency,
            '->',
            treasuryDestination.currency
        );


        if (!replayMode) {

            await postFXAccounting({

                sourceCurrency: transfer.sourceCurrency,

                destinationCurrency: transfer.destinationCurrency,

                sourceAmount: Number(transfer.amount),

                destinationAmount: Number(transfer.amount) *
                    Number(transfer.exchangeRate),

                marketRate: Number(transfer.exchangeRate), // - 0.03

                appliedRate: Number(transfer.exchangeRate),

                transaction

            });

        }

    }


    if (!replayMode) {
        await distributeFees({

            transfer,

            transaction

        });

    }



    let settlementResult;

    if (isInternal) {

        settlementResult =
            await settlementLedgerInternal({

                customerLedger,
                beneficiaryLedger,
                transfer,
                beneficiaryCredit,
                transaction

            });

   } else {

       settlementResult =
           await settlementLedgerExternal({

               customerLedger,
               systemLedger,
               beneficiaryLedger,
               transfer,
               beneficiaryCredit,
               transaction

           });

   }



    await settlementTransactions({

        transfer,

        senderAccount,

        beneficiaryAccount,

        beneficiaryCredit,

        transaction

    });


    console.log('[SETTLEMENT EVENT PAYLOAD]', {
        customerLedger: customerLedger.id,
        systemLedger: systemLedger.id
    });


   //  const settlementResult =
   //  await settlementLedgerExternal(...);        <<< What's inside this?


    // =========================
    // TRANSACTION JOURNAL
    // =========================

    if (!replayMode) {
        await appendLedgerEvent({

            transaction,
            userId: transfer.userId,
            aggregateId: transfer.id,
            aggregateType: 'TRANSFER',
            eventType: 'TRANSFER_SETTLED',

            reference: `${transfer.reference}-SETTLEMENT`,

            payload: {

                debitAccount: settlementResult.debitAccountId,
                creditAccount: settlementResult.creditAccountId,
                beneficiaryType: settlementResult.beneficiaryType,
                sourceAmount: Number(transfer.amount),
                sourceCurrency: transfer.sourceCurrency,
                destinationAmount: Number(beneficiaryCredit),                                                 
                destinationCurrency: transfer.destinationCurrency,
                exchangeRate: transfer.exchangeRate
                
            },

            idempotencyKey: `transfer-settled-${transfer.id}`

        });

    }

}


module.exports = replaySettlement;