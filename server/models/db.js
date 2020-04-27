'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
//var env       = process.env.NODE_ENV || 'production';
//var config    = require(__dirname + './server/config/config.js')[env];
var db        = {};

const sequelize = new Sequelize('heroku_5a536846eec525b', 'bacd2602f8524e', '4376ff1b', {
  host: 'us-cdbr-iron-east-01.cleardb.net',
  dialect: 'mysql'
  // define:{
  //   freezeTableName: true // Model Name == Table Name
  // },

// const sequelize = new Sequelize('emotion', 'gamboa', '1234', {
//   host: 'localhost',
//   dialect: 'mysql',
//   define:{
//     freezeTableName: true // Model Name == Table Name
//   },

  // username: 'bacd2602f8524e',
  // password: '4376ff1b',
  // database: 'heroku_5a536846eec525b',
  // host: 'us-cdbr-iron-east-01.cleardb.net'

  /*pool: {
    
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }*/
});

/*if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}*/

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;