'use strict';

module.exports = (sequelize, DataTypes) => {

  const Job_Position = sequelize.define('Job_Position', {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Código no puede ser nulo.'
        }
      }
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Descripción no puede ser nula.'
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

  return Job_Position;
};

