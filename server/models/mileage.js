'use strict';

module.exports = (sequelize, DataTypes) => {

  const Mileage = sequelize.define('Mileage', {
    initMileage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Kilometraje Inicial no puede ser nulo.'
        }
      }
    },
    endMileage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Kilometraje Final no puede ser nulo.'
        }
      }   
    },
    initDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Hora Inicial no puede ser nula.'
        }
      }   
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Hora Final no puede ser nula.'
        }
      }   
    },
    initFuel: {
      type: DataTypes.STRING,
      allowNull: true  
    },
    endFuel: {
      type: DataTypes.STRING,
      allowNull: true   
    }
  });

  Mileage.associate = (models) => {
    models.Mileage.belongsTo(models.Admin_Vehicle);
  }


  return Mileage;
};

