// models/Document.js
module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define('Document', {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
       },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id', // 👈 tells Sequelize to map to DB column `user_id`
      },
  
      passportKey: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'passport_key', // ✅ important for consistency
      },
      idCardKey: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'id_card_key', // ✅ important for consistency
      },
      licenseKey: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'license_key', // ✅ important for consistency
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
      tableName: 'documents',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',

      // ✅ HOOKS SHOULD BE HERE:
    hooks: {
      afterCreate: (doc) => {
        console.log(`✅ New document created for user ${doc.userId}`);
      }
    }
    });
  
    Document.associate = models => {
      Document.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
    };
  
    return Document;
  };
  