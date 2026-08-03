// services/ledger/runDailyReconciliation.js

// const { fn, col } = require('sequelize');

const {
    sequelize,
    Transfer,
    Transaction,
    LedgerAccount,
    LedgerEntry,
    LedgerEventStream,
    BankAccount
} = require('../../models');

  
  async function runDailyReconciliation() {
  
    const report = {
  
      success: true,
  
      timestamp:
        new Date(),
  
      checks: []
  
    };


    // Individual ledger entries (used by later checks)
    const entries = await LedgerEntry.findAll();
  
    // =========================
    // CHECK 1
    // TOTAL DEBITS == CREDITS
    // =========================

     // const entries =
    //   await LedgerEntry.findAll();
  
    //   let totalDebits = 0;
    //   let totalCredits = 0;
      
    //   for (const entry of entries) {
      
    //       if (entry.type === 'DEBIT')
    //           totalDebits += Number(entry.amount);
      
    //       if (entry.type === 'CREDIT')
    //           totalCredits += Number(entry.amount);
      
    //   }
  
    // report.checks.push({
  
    //   name:
    //     'DOUBLE_ENTRY_BALANCE',
    //     // 'PER_CURRENCY_DOUBLE_ENTRY',
  
    //   passed:
    //     totalDebits === totalCredits,
  
    //   totalDebits,
    //   totalCredits
  
    // });



    // // ???

    // const totals = await LedgerEntry.findAll({

    //     attributes: [

    //         'currency',

    //         'type',

    //         [fn('SUM', col('amount')), 'total']

    //     ],

    //     group: [

    //         'currency',

    //         'type'

    //     ]

    // });


    // // ???


    // const balances = {};

    // for (const row of totals) {

    //     const currency = row.currency;

    //     if (!balances[currency]) {

    //         balances[currency] = {

    //            debit: 0,

    //            credit: 0

    //         };

    //     }

    //     if (row.type === 'DEBIT') {

    //         balances[currency].debit = Number(row.get('total'));

    //     }

    //     if (row.type === 'CREDIT') {

    //         balances[currency].credit = Number(row.get('total'));

    //     }

    // }
    const balances = {};

    for (const entry of entries) {

        const currency = entry.currency;

        if (!balances[currency]) {

            balances[currency] = {

               debit: 0,
               credit: 0

            };

        }

        if (entry.type === 'DEBIT')

           balances[currency].debit += Number(entry.amount);

        else

           balances[currency].credit += Number(entry.amount);

        }



    const imbalancedCurrencies = [];

    for (const [currency, values] of Object.entries(balances)) {

        // if (values.debit !== values.credit) {
          const debit = Number(values.debit.toFixed(2));
          const credit = Number(values.credit.toFixed(2));
          
          if (Math.abs(debit - credit) > 0.01) {
             

            imbalancedCurrencies.push({

                currency,

                debit,
             // debit: values.debit,

                credit
             // credit: values.credit

            });

          }

     }


    report.checks.push({

       name: 'DOUBLE_ENTRY_BALANCE',

       passed: imbalancedCurrencies.length === 0,

       currencies: balances,

       imbalances: imbalancedCurrencies

    });

  
    // =========================
    // CHECK 2
    // NEGATIVE SYSTEM BALANCES
    // =========================
  
    const systemAccounts =
      await LedgerAccount.findAll({
  
        where: {
  
          accountType: [
            'SYSTEM_CLEARING',
            'SYSTEM_FEES',
            'SYSTEM_SUSPENSE',
            'TREASURY'
          ]
  
        }
  
      });
  
    const negativeSystems =
      systemAccounts.filter(account =>
        parseFloat(account.balance) < 0
      );
  
    report.checks.push({
  
      name:
        'NEGATIVE_SYSTEM_BALANCES',
  
      passed:
        negativeSystems.length === 0,
  
      accounts:
        negativeSystems
  
    });
  
    // =========================
    // CHECK 3
    // CUSTOMER LEDGER VS BANK
    // =========================
  
    const customerLedgers =
      await LedgerAccount.findAll({
  
        where: {
          accountType: 'CUSTOMER'
        }
  
      });
  
    const mismatches = [];
  
    for (const ledger of customerLedgers) {
  
      const bankAccounts = await BankAccount.findAll({

        where: {
            userId: ledger.userId
        }
    
    });
    
    if (!bankAccounts.length) {
    
        mismatches.push({
    
            userId: ledger.userId,
    
            reason: 'Missing bank accounts'
    
        });
    
        continue;
    }
    
    const totalLedgerBalance = bankAccounts.reduce(
    
        (sum, account) => sum + Number(account.ledgerBalance),
    
        0
    
    );


     const ledgerBalance = Number(ledger.balance);

if (ledgerBalance !== totalLedgerBalance) {

    mismatches.push({

        userId: ledger.userId,

        ledgerBalance,

        bankLedgerBalance: totalLedgerBalance

    });

    }
 }
  
    report.checks.push({
  
      name:
        'CUSTOMER_LEDGER_MATCH',
  
      passed:
        mismatches.length === 0,
  
      mismatches
  
    });
  
    // =========================
    // CHECK 4
    // ORPHAN LEDGER ENTRIES
    // =========================
  
    const orphanEntries =
      entries.filter(
        entry =>
          !entry.ledgerAccountId
      );
  
    report.checks.push({
  
      name:
        'ORPHAN_LEDGER_ENTRIES',
  
      passed:
        orphanEntries.length === 0,
  
      count:
        orphanEntries.length
  
    });

    // =========================
    // CHECK 5
    // TRANSFERS WITHOUT LEDGER ENTRIES
    // =========================

    const completedTransfers = await Transfer.findAll({    // await models.Transfer.findAll

      where: {
         status: ['SETTLED', 'COMPLETED', 'REVERSED']
      }

  });

      const missingLedgerEntries = [];

      for (const transfer of completedTransfers) {

        const count = await LedgerEntry.count({

        where: {
           transferId: transfer.id
        }

  });

     if (count === 0) {

         missingLedgerEntries.push({

          transferId: transfer.id,
          reference: transfer.reference,
          status: transfer.status

      });

    }

  }

  report.checks.push({

     name: 'TRANSFERS_WITHOUT_LEDGER_ENTRIES',

     passed: missingLedgerEntries.length === 0,

     transfers: missingLedgerEntries

  });

  // =========================
  // CHECK 6
  // LEDGER ENTRIES WITHOUT TRANSFER
  // =========================

    const orphanLedgerEntries = [];

    for (const entry of entries) {

      const transfer = await Transfer.findByPk(entry.transferId);    // await models.Transfer.findbypk

      if (!transfer) {

        orphanLedgerEntries.push({

          ledgerEntryId: entry.id,
          transferId: entry.transferId

      });

    }

  }

  report.checks.push({

     name: 'LEDGER_ENTRIES_WITHOUT_TRANSFER',

     passed: orphanLedgerEntries.length === 0,

     entries: orphanLedgerEntries

  });

  // =========================
  // CHECK 7
  // LEDGER EVENTS WITHOUT TRANSFER
  // =========================

const transferEvents = 
      await LedgerEventStream.findAll({

  where: {

      aggregateType: 'TRANSFER'

  }

});

const orphanEvents = [];

for (const event of transferEvents) {

  const transfer = 
       await Transfer.findByPk(

      event.aggregateId

  );

  if (!transfer) {

      orphanEvents.push({

          eventId: event.id,
          aggregateId: event.aggregateId,
          eventType: event.eventType

      });

  }

}

report.checks.push({

  name: 'TRANSFER_EVENTS_WITHOUT_TRANSFER',

  passed: orphanEvents.length === 0,

  events: orphanEvents

});
 
    // =========================
    // CHECK 8
    // DUPLICATE TRANSACTION REFERENCES
    // =========================

    const duplicateReferences = await sequelize.query(

    `
    SELECT reference,
    COUNT(*) AS total
    FROM transactions
    GROUP BY reference
    HAVING COUNT(*) > 1
    `,
  
    {
  
    type: sequelize.QueryTypes.SELECT
  
    });
  
    report.checks.push({
  
    name: 'DUPLICATE_TRANSACTION_REFERENCES',
  
    passed: duplicateReferences.length === 0,
  
    duplicates: duplicateReferences
  
    });

    // =========================
    // CHECK 9
    // DUPLICATE IDEMPOTENCY KEYS
    // =========================

    const duplicateKeys = await sequelize.query(

    `
    SELECT "idempotencyKey",
    COUNT(*) AS total
    FROM ledger_event_stream
    GROUP BY "idempotencyKey"
    HAVING COUNT(*) > 1
    `,
  
   {
  
    type: sequelize.QueryTypes.SELECT
  
    });
  
    report.checks.push({
  
    name: 'DUPLICATE_IDEMPOTENCY_KEYS',
  
    passed: duplicateKeys.length === 0,
  
    duplicates: duplicateKeys
  
    });

    // =========================
    // CHECK 10
    // EVERY TRANSFER BALANCES
    // =========================

    const allTransfers = await Transfer.findAll();

    const imbalancedTransfers = [];

    for (const transfer of allTransfers) {

    // Ignore legacy transfers created before the new ledger engine
    if (transfer.id < 22) {
        continue;
    }

    const transferEntries = await LedgerEntry.findAll({

           where: {
               transferId: transfer.id
            }

        });

    let debit = 0;
    let credit = 0;

    for (const entry of transferEntries) {

        if (entry.type === 'DEBIT')
            debit += Number(entry.amount);

        if (entry.type === 'CREDIT')
            credit += Number(entry.amount);
    }

    if (debit !== credit) {

        imbalancedTransfers.push({

            transferId: transfer.id,

            reference: transfer.reference,

            status: transfer.status,

            debit,

            credit

        });

    }

}

report.checks.push({

    // name: 'PER_TRANSFER_DOUBLE_ENTRY',
       name: 'TRANSFER_ACCOUNTING_INTEGRITY',

    passed: imbalancedTransfers.length === 0,

    transfers: imbalancedTransfers

});

    // =========================
    // GLOBAL RESULT
    // =========================
  
    const failedChecks =
      report.checks.filter(
        check => !check.passed
      );
  
    report.success =
      failedChecks.length === 0;
  
    report.failedChecks =
      failedChecks.length;
  
    return report;
  
  }
  
  module.exports =
    runDailyReconciliation;