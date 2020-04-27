'use strict';

module.exports = (sequelize, DataTypes) => {

  const Journey = sequelize.define('Journey', {
     date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Fecha no puede ser nula.'
        }
      }
    },
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
          msg: 'Chofer no puede ser nula.'
        }
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      validate: {
      }
    }
  });

  Journey.associate = (models) => {
    models.Journey.hasOne(models.Document_Detail);
  }

  return Journey;
};

