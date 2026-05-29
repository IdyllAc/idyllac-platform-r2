// models/beneficiary.js
module.exports = (sequelize, DataTypes) => {

    const Beneficiary = sequelize.define('Beneficiary', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      bankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
  
      beneficiaryName: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      iban: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      bic: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      bankName: {
        type: DataTypes.STRING,
        allowNull: true
      },
  
      country: {
        type: DataTypes.STRING,
        defaultValue: 'FR'
      },
  
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'EUR'
      },
  
      transferNetwork: {
        type: DataTypes.STRING,
        defaultValue: 'SEPA'
      },
  
      status: {
        type: DataTypes.ENUM(
          'ACTIVE',
          'BLOCKED',
          'PENDING'
        ),
        defaultValue: 'ACTIVE'
      },
  
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  
      isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  
      lastUsedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
  
    }, {
  
      tableName: 'beneficiaries'
  
    });
  
    Beneficiary.associate = (models) => {
  
      Beneficiary.belongsTo(models.User, {
  
        foreignKey: 'userId',
  
        as: 'user',
  
        onDelete: 'CASCADE',
  
        onUpdate: 'CASCADE'
  
      });
  
      Beneficiary.belongsTo(models.BankAccount, {
  
        foreignKey: 'bankAccountId',
  
        as: 'bankAccount',
  
        onDelete: 'SET NULL',
  
        onUpdate: 'CASCADE'
  
      });
  
    };
  
    return Beneficiary;
  
  };