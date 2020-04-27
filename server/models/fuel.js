'use strict';

module.exports = (sequelize, DataTypes) => {

  const Fuel = sequelize.define('Fuel', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Código no puede ser nulo.'
        }
      }
    },
    liter: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Descripción no puede ser nula.'
        }
      }   
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Descripción no puede ser nula.'
        }
      }   
    },
    mileage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Descripción no puede ser nula.'
        }
      }   
    }
  });

  Fuel.associate = (models) => {
    models.Fuel.belongsTo(models.Admin_Vehicle);
  }

  return Fuel;
};

