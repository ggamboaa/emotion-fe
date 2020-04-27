'use strict';

module.exports = (sequelize, DataTypes) => {

  const Speed_Rating = sequelize.define('Speed_Rating', {
    speedRating: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Índice de Velocidad no puede ser nulo.'
        }
      }
    }
  });

  return Speed_Rating;
};