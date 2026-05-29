// models/ledgerEntry.js
module.exports = (sequelize, DataTypes) => {

    const LedgerEntry = sequelize.define('LedgerEntry', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      ledgerAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      transferId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      reference: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      type: {
        type: DataTypes.ENUM(
          'DEBIT',
          'CREDIT'
        ),
        allowNull: false
      },
  
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false
      },
  
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'EUR'
      },
  
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
  
    }, {
  
      tableName: 'ledger_entries'
  
    });
  
    LedgerEntry.associate = (models) => {
  
      LedgerEntry.belongsTo(models.LedgerAccount, {
  
        foreignKey: 'ledgerAccountId',
  
        as: 'ledgerAccount'
  
      });
  
      LedgerEntry.belongsTo(models.Transfer, {
  
        foreignKey: 'transferId',
  
        as: 'transfer'
  
      });
  
    };
  
    return LedgerEntry;
  
  };