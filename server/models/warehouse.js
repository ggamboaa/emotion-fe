'use strict';

module.exports = (sequelize, DataTypes) => {

  let Warehouse = sequelize.define('Warehouse', {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Código no puede ser nulo.'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nombre no puede ser nulo.'
        }
      }   
    },
    phone1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Teléfono no puede ser nulo.'
        }
      }  
    },
    phone2: {
      type: DataTypes.STRING,
      validate: {
      }   
    },
    address: {
      type: DataTypes.STRING,
      validate: {
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

  return Warehouse;
};

