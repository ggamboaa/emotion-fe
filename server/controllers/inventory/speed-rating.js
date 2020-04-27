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
    models.Speed_Rating.findAndCountAll({
      // limit: limit,
      // offset: offset,
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{speedRating: {[Op.like]:'%'+filter+'%'}}] 
      }
    })
    .then(Speed_Ratings => {
      res.status(200).json({'records': Speed_Ratings.rows, 'totalRecords':Speed_Ratings.count/*, 'numberOfPageRecords': limit*/});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Speed_Rating.findAndCountAll({
      // limit: limit,
      // offset: offset,
      order: [[sort, direction]]
    })
    .then(Speed_Ratings => {
      // let pages = Math.ceil(Speed_Ratings.count / limit);  
      res.status(200).json({'records': Speed_Ratings.rows, 'totalRecords':Speed_Ratings.count/*, 'totalPages': pages,
        'numberOfPageRecords': limit*/});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 