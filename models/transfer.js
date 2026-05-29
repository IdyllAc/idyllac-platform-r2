// models/transfer.js
module.exports = (sequelize, DataTypes) => {

    const Transfer = sequelize.define('Transfer', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      senderAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      beneficiaryId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      reference: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
  
      transferType: {
        type: DataTypes.ENUM(
          'INTERNAL',
          'SEPA',
          'SWIFT',
          'ACH',
          'FPS'
        ),
        defaultValue: 'SEPA'
      },
  
      direction: {
        type: DataTypes.ENUM(
          'OUTBOUND',
          'INBOUND'
        ),
        defaultValue: 'OUTBOUND'
      },
  
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false
      },
  
      feeAmount: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0
      },
  
      exchangeRate: {
        type: DataTypes.DECIMAL(18, 8),
        defaultValue: 1
      },
  
      sourceCurrency: {
        type: DataTypes.STRING,
        defaultValue: 'EUR'
      },
  
      destinationCurrency: {
        type: DataTypes.STRING,
        defaultValue: 'EUR'
      },
  
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
  
      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'AUTHORIZED',
          'SETTLED',
          'PROCESSING',
          'COMPLETED',
          'FAILED',
          'REVERSED',
          'CANCELLED'
        ),
        defaultValue: 'PENDING'
      },
  
      executedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
  
    }, {
  
      tableName: 'transfers'
  
    });
  
    Transfer.associate = (models) => {
  
      Transfer.belongsTo(models.User, {
  
        foreignKey: 'userId',
  
        as: 'user'
  
      });
  
      Transfer.belongsTo(models.BankAccount, {
  
        foreignKey: 'senderAccountId',
  
        as: 'senderAccount'
  
      });
  
      Transfer.belongsTo(models.Beneficiary, {
  
        foreignKey: 'beneficiaryId',
  
        as: 'beneficiary'
  
      });
  
    };
  
    return Transfer;
  
  };