// models/transaction.js
module.exports = (sequelize, DataTypes) => {

    const Transaction = sequelize.define('Transaction', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      bankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      cardId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
  
      reference: {
        type: DataTypes.STRING,
        unique: true
      },
  
      type: {
        type: DataTypes.ENUM(
          'DEPOSIT',
          'WITHDRAWAL',
          'TRANSFER',
          'CARD_PAYMENT',
          'REFUND',
          'FEE',
          'REVERSAL'
        ),
        allowNull: false
      },
  
      direction: {
        type: DataTypes.ENUM(
          'CREDIT',
          'DEBIT'
        ),
        allowNull: false
      },
  
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },
  
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'EUR'
      },
  
      description: {
        type: DataTypes.STRING
      },
  
      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'PROCESSING',
          'COMPLETED',
          'FAILED',
          'REVERSED',
          'CANCELLED'
        ),
        defaultValue: 'PENDING'
      },
  
      balanceBefore: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
      },
  
      balanceAfter: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
      }
  
    }, {
  
      tableName: 'transactions'
  
    });
  
    Transaction.associate = (models) => {
  
      Transaction.belongsTo(models.BankAccount, {
  
        foreignKey: 'bankAccountId',
  
        as: 'bankAccount'
  
      });
  
      Transaction.belongsTo(models.Card, {
  
        foreignKey: 'cardId',
  
        as: 'card'
  
      });
  
    };
  
    return Transaction;
  
  };