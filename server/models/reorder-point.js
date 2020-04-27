'use strict';

module.exports = (sequelize, DataTypes) => {

const Reorder_Point = sequelize.define('Reorder_Point', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  WarehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Sucursal no puede ser nulo.'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
       msg: 'Cantidad no puede ser nulo.'
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
  }
},
{
  indexes: [{unique: true, fields: ['productId','WarehouseId']}]
});

 Reorder_Point.associate = (models) => {
   models.Reorder_Point.belongsTo(models.Product);
 }

 
 return Reorder_Point;

};