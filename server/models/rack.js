'use strict';

module.exports = (sequelize, DataTypes) => {

  const Rack = sequelize.define('Rack', {
    rackName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Rack no puede ser nulo.'
        }
      }
    }
  });

  return Rack;
};

