'use strict';

module.exports = (sequelize, DataTypes) => {

const Repair_Detail = sequelize.define('Repair_Detail', {
	typeRepair: {
	  type: DataTypes.INTEGER,
	  allowNull: false,
	  validate: {
	    notNull: {
	      msg: 'Detalle no puede ser nulo.'
	    }
	  } 
	},	
  	detail: {
	  type: DataTypes.STRING,
	  allowNull: false,
	  validate: {
	    notNull: {
	      msg: 'Detalle no puede ser nulo.'
	    }
	  } 
	},
	amount: {
	  type: DataTypes.DOUBLE,
	  allowNull: false
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
    tableName: 'Repair_Detail',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deteledAT',
    paranoid: true,
    timestamps: true,
});

Repair_Detail.associate = (models) => {
  models.Repair_Detail.belongsTo(models.Repair, {onDelete: 'RESTRICT' });
}

 return Repair_Detail;

};