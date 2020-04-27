'use strict';

module.exports = (sequelize, DataTypes) => {

  const Position = sequelize.define('Position', {
    positionName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Posición no puede ser nulo.'
        }
      }
    }
  });

  return Position;
};

