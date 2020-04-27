
'use strict';

module.exports = (sequelize, DataTypes) => {

  let Vehicle = sequelize.define('Vehicle', {
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Marca no puede ser nula.'
        }
      }
    },
    vehicleType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Tipo de Vehículo no puede ser nulo.'
        }
      }   
    },
    fuelType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Combustible no puede ser nulo.'
        }
      }   
    },
    transmissionType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Transmisión no puede ser nula.'
        }
      }   
    },
    model: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Modelo no puede ser nulo.'
        }
      }   
    },
    licensePlate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Placa no puede ser nula.'
        }
      }   
    },
    engine: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Cilindraje no puede ser nulo.'
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
  });


  Vehicle.associate = (models) => {
    //Relación 1:N
    models.Vehicle.hasMany(models.Oil);//, {through: 'mileage', onDelete: 'RESTRICT'}
  }

  return Vehicle;
};

