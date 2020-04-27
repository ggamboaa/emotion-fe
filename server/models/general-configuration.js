'use strict';

module.exports = (sequelize, DataTypes) => {

  const General_Configuration = sequelize.define('General_Configuration', {
    nextDocCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Código no puede ser nulo.'
        }
      }
    }
  });

  return General_Configuration;
};

