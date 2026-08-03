// services/settlement/settlementTransactions.js

const { Transaction } = require('../../models');

async function settlementTransactions({

    transfer,

    senderAccount,

    beneficiaryAccount,

    beneficiaryCredit,

    transaction

}) {

    const settlementReference =
        `${transfer.reference}-SETTLEMENT`;

    const balanceBefore =
        Number(senderAccount.balance) +
        Number(transfer.amount);

    const balanceAfter =
        Number(senderAccount.balance);

    await Transaction.create({

        transferId: transfer.id,

        bankAccountId: senderAccount.id,

        reference:
            `${transfer.reference}-SETTLEMENT-OUT`,

        type: 'TRANSFER',

        direction: 'DEBIT',

        amount: transfer.amount,

        currency: transfer.sourceCurrency,

        description: transfer.description,

        status: 'COMPLETED',

        balanceBefore,

        balanceAfter

    }, {

        transaction

    });

    await Transaction.create({

        transferId: transfer.id,

        bankAccountId: beneficiaryAccount.id,

        reference:
            `${transfer.reference}-SETTLEMENT-IN`,

        type: 'TRANSFER',

        direction: 'CREDIT',

        amount: beneficiaryCredit,

        currency: transfer.destinationCurrency,

        description: transfer.description,

        status: 'COMPLETED',

        balanceBefore:
            Number(beneficiaryAccount.balance),

        balanceAfter:
            Number(beneficiaryAccount.balance) +
            beneficiaryCredit

    }, {

        transaction

    });

}

module.exports = settlementTransactions;










// await Transaction.create({

//     transferId: transfer.id,

//     bankAccountId: transfer.senderAccountId,
  
//     reference:
//            `${transfer.reference}-SETTLEMENT-OUT`,
//           //  settlementReference,
  
//     type:  'TRANSFER',
//         //  transfer.transferType,
  
//     direction: 'DEBIT',
//           //  'OUTBOUND',
//           //  transfer.direction, 
  
//     amount: transfer.amount,
  
//     currency: transfer.sourceCurrency,
  
//     description:
//         transfer.description,
  
//     status: 'COMPLETED',
  
//     balanceBefore: balanceBefore,
  
//     balanceAfter:  balanceAfter
  
//   }, {
//     transaction: t
//   });



//   await Transaction.create({

//     transferId: transfer.id,

//     bankAccountId: 
//             beneficiaryAccount.id,
//         //  beneficiary.bankAccountId,
  
//     reference:
//            `${transfer.reference}-SETTLEMENT-IN`,
//           //  settlementReference,
  
//     type: 'TRANSFER',
//       // transfer.transferType,
  
//     direction: 'CREDIT',
//         //  'INBOUND',
  
//     amount:
//         beneficiaryCredit,
//         // Number(transfer.amount)
//         // * Number(transfer.exchangeRate),
  
//     currency:
//         transfer.destinationCurrency,
  
//     description:
//         transfer.description,
  
//     status: 'COMPLETED',
  
//     balanceBefore:
//            beneficiaryBalanceBefore,
//         // beneficiary.balanceBefore,
  
//     balanceAfter:
//            beneficiaryBalanceBefore +
//            beneficiaryCredit
//         // beneficiary.balanceAfter
  
//   },{
//     transaction:t
//   });

