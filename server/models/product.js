'use strict';

module.exports = (sequelize, DataTypes) => {

  const Product = sequelize.define('Product', {
     typeProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Tipo de Producto no puede ser nulo.'
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
    description: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    color: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Código no puede ser nulo.'
        }
      }
    },
    barCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    series: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    size: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    width: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    basin: {
      type: DataTypes.STRING,
      validate: {
      }   
    },
    basin2: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    diameter: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    measure: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    offset: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    centerHole: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    finish: {
      type: DataTypes.STRING,
      validate: {
      }
    },
    status: {
      type: DataTypes.INTEGER,
      validate: {
      }
    }
  },{
    indexes: [{unique: true, fields: ['code']}]
  });

  Product.associate = (models) => {
    //Relación 1:1
    models.Product.belongsTo(models.Brand, { as: 'brand', onDelete: 'CASCADE' });
    models.Product.belongsTo(models.Speed_Rating, { as: 'speedRating', onDelete: 'CASCADE' });
    models.Product.belongsTo(models.Load_Index, { as: 'loadIndex', onDelete: 'CASCADE' });
     
    //Relación N:M
    models.Product.belongsToMany(models.Document, {through: 'Document_Product_List', onDelete: 'RESTRICT'});
    
    //Relación 1:N
    models.Product.hasMany(models.Ubication_Product_List);
    models.Product.hasMany(models.Reorder_Point);
  }

  return Product;
};

