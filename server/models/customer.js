'use strict';

module.exports = (sequelize, DataTypes) => {

  const Customer = sequelize.define('Customer', {
    typeCustomer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Tipo de Cliente no puede ser nulo.'
        }
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressCompany: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneCompany1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identification: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Identificación no puede ser nula.'
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Primer Apellido no puede ser nulo.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Segundo Apellido no puede ser nulo.'
        }
      }
    },
    phone1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Teléfono 1 no puede ser nulo.'
        }
      }
    },
    phone2: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email no puede ser nulo.'
        },
        isEmail: {
          msg: 'Debe ser un correo válido.'
        }
      }
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observations: {
      type: DataTypes.STRING,
      allowNull: true
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

  Customer.associate = (models) => {
    //Relación 1:1
    models.Customer.belongsTo(models.Warehouse, { as: 'warehouse', onDelete: 'CASCADE' });
  }

  return Customer;
};

