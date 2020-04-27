'use strict';

module.exports = (sequelize, DataTypes) => {

  const Document = sequelize.define('Document', {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Código no puede ser nulo.'
        }
      } 
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Fecha no puede ser nula.'
        }
      } 
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Usuario no puede ser nulo.'
        }
      } 
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Estado no puede ser nulo.'
        }
      } 
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    paranoid: true,
    timestamps: true,
  });


  Document.associate = (models) => {
    //Relación 1:1
    models.Document.belongsTo(models.Type_Document, { onDelete: 'CASCADE' });
    models.Document.belongsTo(models.Warehouse, { onDelete: 'CASCADE' });

    models.Document.hasOne(models.Document_Detail);

    //Relación N:M
    models.Document.belongsToMany(models.Product, {through: 'Document_Product_List', onDelete: 'RESTRICT'});
    
  }

   return Document;
};


