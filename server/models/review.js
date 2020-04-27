'use strict';

module.exports = (sequelize, DataTypes) => {

  const Review = sequelize.define('Review', {
    oilLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nivel de Aceite no puede ser nulo.'
        }
      }
    },
    coolantLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nivel de Refrigerante no puede ser nulo.'
        }
      }   
    },
    brakeLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nivel de Liquido de Freno no puede ser nulo.'
        }
      }
    },
    light: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Luces no puede ser nulo.'
        }
      }   
    },
    brake: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Frenos no puede ser nulo.'
        }
      }
    },
    oil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Aceite no puede ser nulo.'
        }
      }   
    },
    tirePressure: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Presion de llantas no puede ser nulo.'
        }
      }
    },
    tireCondition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Estado fisico de las llantas no puede ser nulo.'
        }
      }   
    },
    wiper: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Limpia parabrisas no puede ser nulo.'
        }
      }
    },
    cabinBody: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Carrocería y Cabina no puede ser nula.'
        }
      }   
    },
    commentary: {
      type: DataTypes.STRING,
      allowNull: true 
    }
  });


  return Review;
};

