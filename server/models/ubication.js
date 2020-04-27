'use strict';

module.exports = (sequelize, DataTypes) => {

const Ubication = sequelize.define('Ubication', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ubicationName: {
    type: DataTypes.STRING,
    allowNull: false,
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

 Ubication.associate = (models) => {
  //Relación 1:1
   models.Ubication.belongsTo(models.Rack, {onDelete: 'RESTRICT' });
   models.Ubication.belongsTo(models.Position, {onDelete: 'RESTRICT' });
   models.Ubication.belongsTo(models.Level, {onDelete: 'RESTRICT' });
   models.Ubication.belongsTo(models.Warehouse, {onDelete: 'RESTRICT' });

   //Relación 1:N
   models.Ubication.hasMany(models.Ubication_Product_List);

 }

 
 return Ubication;

};