'use strict';

module.exports = (sequelize, DataTypes) => {

  const Reservation = sequelize.define('Reservation', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Fecha Solicitud no puede ser nula.'
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Fecha Salida no puede ser nula.'
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Fecha Entrega no puede ser nula.'
        }
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Usuario no puede ser nulo.'
        }
      } 
    }
  });

  Reservation.associate = (models) => {
    //Relación 1:1
    models.Reservation.belongsTo(models.Vehicle, { as:'vehicle', onDelete: 'RESTRICT' });
    models.Reservation.belongsTo(models.Employee, { as:'employee', onDelete: 'RESTRICT' });
  }

  return Reservation;
};

