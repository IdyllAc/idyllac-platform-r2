// services/ledger/runDailyReconciliation.js

const { LedgerAccount, LedgerEntry, BankAccount } = require('../../models');
  
  async function runDailyReconciliation() {
  
    const report = {
  
      success: true,
  
      timestamp:
        new Date(),
  
      checks: []
  
    };
  
    // =========================
    // CHECK 1
    // TOTAL DEBITS == CREDITS
    // =========================
  
    const entries =
      await LedgerEntry.findAll();
  
    let totalDebits = 0;
    let totalCredits = 0;
  
    for (const entry of entries) {
  
      const amount =
        parseFloat(entry.amount);
  
      if (entry.type === 'DEBIT') {
  
        totalDebits += amount;
  
      }
  
      if (entry.type === 'CREDIT') {
  
        totalCredits += amount;
  
      }
  
    }
  
    report.checks.push({
  
      name:
        'DOUBLE_ENTRY_BALANCE',
  
      passed:
        totalDebits === totalCredits,
  
      totalDebits,
      totalCredits
  
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
  
      const bank =
        await BankAccount.findOne({
  
          where: {
            userId: ledger.userId
          }
  
        });
  
      if (!bank) {
  
        mismatches.push({
  
          userId:
            ledger.userId,
  
          reason:
            'Missing bank account'
  
        });
  
        continue;
  
      }
  
      const ledgerBalance =
        parseFloat(ledger.balance);
  
      const bankBalance =
        parseFloat(bank.balance);
  
      if (ledgerBalance !== bankBalance) {
  
        mismatches.push({
  
          userId:
            ledger.userId,
  
          ledgerBalance,
          bankBalance
  
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