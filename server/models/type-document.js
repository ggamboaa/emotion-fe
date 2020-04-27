'use strict';

module.exports = (sequelize, DataTypes) => {

  const Type_Document = sequelize.define('Type_Document', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nombre no puede ser nulo.'
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

  return Type_Document;
};

