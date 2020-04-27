'use strict';

module.exports = (sequelize, DataTypes) => {

  const Tracking = sequelize.define('Tracking', {
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

  Tracking.associate = (models) => {
    //Relación 1:1
    models.Tracking.belongsTo(models.Document, { as: 'document', onDelete: 'CASCADE' });
  }

  return Tracking;
};
