'use strict';

module.exports = (sequelize, DataTypes) => {

  const Document_Product_List = sequelize.define('Document_Product_List', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Cantidad no puede ser nula.'
        }
      }
    },
    WarehouseId: {
      type: DataTypes.INTEGER,
      foreingKey: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Estado no puede ser nulo.'
        }
      } 
    }
  },
  {
    deletedAt: 'deteledAT',
    paranoid: true,
    timestamps: true,
  });

  Document_Product_List.associate = (models) => {
    //Relación 1:1
    models.Document_Product_List.belongsTo(models.Document,{ onDelete: 'RESTRICT' });
  }



  return Document_Product_List;
};
