'use strict';

module.exports = (sequelize, DataTypes) => {

  const Rol = sequelize.define('Rol', {
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

  Rol.associate = (models) => {
    //Relación N:M
  	models.Rol.belongsToMany(models.User, {through: 'Rol_User_List', onDelete: 'RESTRICT'});
  }

  return Rol;
};

