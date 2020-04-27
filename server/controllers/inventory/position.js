'use strict';

const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAll = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let filter = null;
  
  if(req.query.filter){
    filter = req.query.filter; 
  }
  if(req.query.pagesize){
    limit = parseInt(req.query.pagesize); 
  }
  if(req.query.page){
    page = parseInt(req.query.page);      
  }
  if(req.query.direction){
    direction = req.query.direction;
  }
  if(req.query.sort){
    sort = req.query.sort;
  }
  
  let offset = page * limit;

  if(filter){
    models.Position.findAndCountAll({
      order: [[sort, direction]],
      where:{
        positionName: {[Op.like]:'%'+filter+'%'}
      } 
    })
    .then(positions => {
      res.status(200).json({'records': positions.rows, 'totalRecords':positions.count});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Position.findAndCountAll({
      order: [[sort, direction]]
    })
    .then(positions => {
      res.status(200).json({'records': positions.rows, 'totalRecords':positions.count});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 