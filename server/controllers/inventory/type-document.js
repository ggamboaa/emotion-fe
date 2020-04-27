'use strict';

const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAll = (req, res) => {
  // let limit = 5;
  // let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let filter = null;
  
  if(req.query.filter){
    filter = req.query.filter; 
  }
  // if(req.query.pagesize){
  //   limit = parseInt(req.query.pagesize); 
  // }
  // if(req.query.page){
  //   page = parseInt(req.query.page);      
  // }
  if(req.query.direction){
    direction = req.query.direction;
  }
  if(req.query.sort){
    sort = req.query.sort;
  }
  
  // let offset = page * limit;

  if(filter){
    models.Type_Document.findAndCountAll({
      // limit: limit,
      // offset: offset,
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{loadIndex: {[Op.like]:'%'+filter+'%'}}] 
      }
    })
    .then(Type_Documents => {
      res.status(200).json({'records': Type_Documents.rows, 'totalRecords':Type_Documents.count/*, 'numberOfPageRecords': limit*/});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Type_Document.findAndCountAll({
      // limit: limit,
      // offset: offset,
      order: [[sort, direction]]
    })
    .then(Type_Documents => {
      // let pages = Math.ceil(Type_Documents.count / limit);  
      res.status(200).json({'records': Type_Documents.rows, 'totalRecords':Type_Documents.count/*, 'totalPages': pages,
        'numberOfPageRecords': limit*/});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}


exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Type_Document.findByPk(id, {})
  .then((upl) => {
    res.json(upl);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}