'use strict';

module.exports = (sequelize, DataTypes) => {

const Repair = sequelize.define('Repair', {
  damageDate: {
	  type: DataTypes.DATE,
	  allowNull: false,
	  validate: {
	    notNull: {
	      msg: 'Fecha del Daño no puede ser nula.'
	    }
	  } 
	},
	repairDate: {
	  type: DataTypes.DATE,
	  allowNull: false,
	  validate: {
	    notNull: {
	      msg: 'Fecha de Reparación no puede ser nula.'
	    }
	  } 
	},
	user: {
	  type: DataTypes.STRING,
	  allowNull: false,
	  validate: {
	    notNull: {
	      msg: 'Usuario no puede ser nulo.'
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
    tableName: 'Repair',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deteledAT',
    paranoid: true,
    timestamps: true,
});

Repair.associate = (models) => {
  //Relación 1:1
  models.Repair.belongsTo(models.Vehicle, {onDelete: 'CASCADE' });

  //Relación 1:N
  models.Repair.hasMany(models.Repair_Detail);
}

 return Repair;

};