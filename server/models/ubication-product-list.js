'use strict';

module.exports = (sequelize, DataTypes) => {

  const Ubication_Product_List = sequelize.define('Ubication_Product_List', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DocumentId: {
      type: DataTypes.INTEGER,
      foreingKey: true
    },
    UbicationId: {
      type: DataTypes.INTEGER,
      foreingKey: true
    },
    WarehouseId: {
      type: DataTypes.INTEGER,
      foreingKey: true
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
    }
  });

  Ubication_Product_List.associate = (models) => {
    //Relación 1:1
    models.Ubication_Product_List.belongsTo(models.Ubication,{ onDelete: 'RESTRICT' });
    models.Ubication_Product_List.belongsTo(models.Product,{ onDelete: 'RESTRICT' });
    models.Ubication_Product_List.belongsTo(models.Warehouse,{ onDelete: 'RESTRICT' });
  }

  return Ubication_Product_List;
};

