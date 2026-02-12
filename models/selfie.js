// models/Selfie.js
module.exports = (sequelize, DataTypes) => {
    const Selfie = sequelize.define('Selfie', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id', // 👈 tells Sequelize to map to DB column `user_id`
      },
  
      selfieKey: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'selfie_key', // ✅ important for consistency
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_verified',
      },      
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'verified_at',
      },      
    }, {
      tableName: 'selfies',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at', 
    });
  
    Selfie.associate = models => {
      Selfie.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
    };
  
    return Selfie;
  };
  