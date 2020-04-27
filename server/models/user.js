'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Usuario no puede ser nulo.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          msg: 'Contraseña debe ser alfanumérica.'
        },
        notNull: {
          msg: 'Contraseña no puede ser nula.'
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
  },
  {
    indexes: [{unique: true, fields: ['user']}]
  });

  User.associate = (models) => {
    //Relación N:M
    models.User.belongsToMany(models.Rol, {through: 'Rol_User_List', onDelete: 'RESTRICT'});
    
    //Relación 1:1
    models.User.belongsTo(models.Employee, { as: 'employee', onDelete: 'RESTRICT' });
  }

  return User;
};

