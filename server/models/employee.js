'use strict';

module.exports = (sequelize, DataTypes) => {

  const Employee = sequelize.define('Employee', {
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
          msg: 'Apellido 1 no puede ser nulo.'
        }
      } 
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Apellido 2 no puede ser nulo.'
        }
      }
    },
    identification: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Cédula no puede ser nula.'
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
      type: DataTypes.STRING,
      allowNull: true
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
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: true,
      validate: {
        notEmpty: true
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
    },
    maritalStatus: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observations: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  
  Employee.associate = (models) => {
    //Relación 1:1
    models.Employee.belongsTo(models.Department, { as:'department', onDelete:'CASCADE'});
    models.Employee.belongsTo(models.Job_Position, { as:'jobPosition', onDelete:'CASCADE'});

    //Relación N:M
    models.Employee.belongsToMany(models.Warehouse, {through: 'Employee_Warehouse_List', onDelete: 'RESTRICT'});
  }
  
  return Employee;
};

