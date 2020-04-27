'use strict';

module.exports = (sequelize, DataTypes) => {

  const Oil = sequelize.define('Oil', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Fecha no puede ser nula.'
        }
      }
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Costo no puede ser nulo.'
        }
      }
    },
    typeOil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Tipo de Aceite no puede ser nulo.'
        }
      }
    },
    mileageOld: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Kilometraje Inicial no puede ser nula.'
        }
      }   
    },
    mileageNew: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Kilometraje Maximo no puede ser nulo.'
        }
      } 
    },
    commentary: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Oil.associate = (models) => {
    models.Oil.belongsTo(models.Vehicle);
  }

  return Oil;
};

