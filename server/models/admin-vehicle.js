'use strict';

module.exports = (sequelize, DataTypes) => {

  const Admin_Vehicle = sequelize.define('Admin_Vehicle', {
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Vehiculo no puede ser nulo.'
        }
      } 
    },
    driverEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Chofer no puede ser nulo.'
        }
      } 
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Sucursal no puede ser nulo.'
        }
      } 
    },
    userId: {
      type: DataTypes.INTEGER,
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


  Admin_Vehicle.associate = (models) => {
    //Relación 1:1
    models.Admin_Vehicle.belongsTo(models.Vehicle,{ as: 'vehicle', onDelete: 'RESTRICT' });

    models.Admin_Vehicle.hasOne(models.Review, {through: 'review', onDelete: 'RESTRICT'});

    // Relación 1:N
    models.Admin_Vehicle.hasMany(models.Mileage);//, {through: 'mileage', onDelete: 'RESTRICT'}

    models.Admin_Vehicle.hasMany(models.Fuel); //, {through: 'fuel', onDelete: 'RESTRICT'}
  }

   return Admin_Vehicle;
};


