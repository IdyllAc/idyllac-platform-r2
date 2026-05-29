// models/ledgerAccount.js
module.exports = (sequelize, DataTypes) => {

    const LedgerAccount = sequelize.define('LedgerAccount', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
  
      accountType: {
        type: DataTypes.ENUM(
          'CUSTOMER',
          'SYSTEM_CLEARING',
          'SYSTEM_FEES',
          'SYSTEM_SUSPENSE',
          'TREASURY'
        ),
        allowNull: false
      },
  
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'EUR'
      },
  
      balance: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0
      }
  
    }, {
  
      tableName: 'ledger_accounts'
  
    });
  
    LedgerAccount.associate = (models) => {
  
      LedgerAccount.hasMany(models.LedgerEntry, {
  
        foreignKey: 'ledgerAccountId',
  
        as: 'entries'
  
      });
  
    };
  
    return LedgerAccount;
  
  };