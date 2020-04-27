'use strict';

module.exports = (sequelize, DataTypes) => {

  const Level = sequelize.define('Level', {
    levelName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nivel no puede ser nulo.'
        }
      }
    }
  });

  return Level;
};

