// models/bankAccount.js

module.exports = (sequelize, DataTypes) => {

    const BankAccount = sequelize.define('BankAccount', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      accountName: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      // =====================================
      // BANKING IDENTIFIERS
      // =====================================
  
      iban: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
  
      bic: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      accountNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
  
      // =====================================
      // INTERNAL LEDGER
      // =====================================
  
      ledgerAccountNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
  
      // =====================================
      // CURRENCY SYSTEM
      // =====================================
  
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'EUR'
      },
  
      country: {
        type: DataTypes.STRING,
        defaultValue: 'FR'
      },
  
      // =====================================
      // BALANCES
      // =====================================
  
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
      },
  
      availableBalance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
      },

      ledgerBalance: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0
      },
  
      pendingBalance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
      },
  
      blockedBalance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
      },
  
      // =====================================
      // ACCOUNT TYPE
      // =====================================

      accountCategory: {
        type: DataTypes.STRING,
        defaultValue: 'PERSONAL'
      },
  
      type: {
        type: DataTypes.ENUM(
          'CHECKING',
          'SAVINGS',
          'BUSINESS',
          'CRYPTO',
          'VAULT'
        ),
        defaultValue: 'CHECKING'
      },
  
      // =====================================
      // ACCOUNT STATUS
      // =====================================
  
      status: {
        type: DataTypes.ENUM(
          'ACTIVE',
          'PENDING',
          'SUSPENDED',
          'CLOSED'
        ),
        defaultValue: 'ACTIVE'
      },
  
      // =====================================
      // ACCOUNT FLAGS
      // =====================================
  
      isJointAccount: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      isClosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  
      isFrozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  
      allowsInternationalTransfers: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
  
      // =====================================
      // LIMITS
      // =====================================
  
      dailyTransferLimit: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 10000
      },
  
      monthlyTransferLimit: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 100000
      },
  
      // =====================================
      // TIMESTAMPS
      // =====================================
  
      activatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },

      closedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      
    }, {
  
      tableName: 'bank_accounts'
  
    });
  
    // =====================================
    // ASSOCIATIONS
    // =====================================
  
    BankAccount.associate = (models) => {
  
      BankAccount.belongsTo(models.User, {
  
        foreignKey: 'userId',
  
        as: 'user',
  
        onDelete: 'CASCADE',
  
        onUpdate: 'CASCADE'
  
      });
  
      BankAccount.hasMany(models.Card, {
  
        foreignKey: 'bankAccountId',
  
        as: 'cards'
  
      });
  
      BankAccount.hasMany(models.Transaction, {
  
        foreignKey: 'bankAccountId',
  
        as: 'transactions'
  
      });
  
    };
  
    return BankAccount;
  
  };