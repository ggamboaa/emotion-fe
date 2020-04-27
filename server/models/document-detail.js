'use strict';

module.exports = (sequelize, DataTypes) => {

  const Document_Detail = sequelize.define('Document_Detail', {
    WarehouseOrigin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    WarehouseDestination: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CustomerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    typeSaleOrder: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numberInvoice: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Número de Factura ya existe!'
      },  
      allowNull: true,
    }
  });

  Document_Detail.associate = (models) => {
    //Relación 1:1
    models.Document_Detail.belongsTo(models.Document,{ onDelete: 'RESTRICT' });
    models.Document_Detail.belongsTo(models.Journey,{ onDelete: 'RESTRICT' });
  }



  return Document_Detail;
};
