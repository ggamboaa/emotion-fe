'use strict';

module.exports = (sequelize, DataTypes) => {

  const General_Register = sequelize.define('General_Register', {
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

  General_Register.associate = (models) => {
    //Relación 1:1
    models.General_Register.belongsTo(models.Document, { as: 'document', onDelete: 'CASCADE' });
  }

  return General_Register;
};
