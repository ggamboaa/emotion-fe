'use strict';

module.exports = (sequelize, DataTypes) => {

  const Load_Index = sequelize.define('Load_Index', {
    loadIndex: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Índice de carga no puede ser nulo.'
        }
      }
    }
  });

  return Load_Index;
};

