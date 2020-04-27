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
    models.Document_Product_List.findAndCountAll({
      // limit: limit,
      // offset: offset,
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{loadIndex: {[Op.like]:'%'+filter+'%'}}] 
      }
    })
    .then(dpl => {
      res.status(200).json({'records': dpl.rows, 'totalRecords':dpl.count/*, 'numberOfPageRecords': limit*/});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Document_Product_List.findAndCountAll({
      // limit: limit,
      // offset: offset,
      order: [[sort, direction]]
    })
    .then(dpl => {
      // let pages = Math.ceil(Row_Documents.count / limit);  
      res.status(200).json({'records': dpl.rows, 'totalRecords':dpl.count/*, 'totalPages': pages,
        'numberOfPageRecords': limit*/});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Document_Product_List.findByPk(id, {})
  .then(dpl => {
    res.json(dpl);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.Document_Product_List.create(req.body)
    .then((dpl) => {
      res.send(dpl);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Document_Product_List.update(req.body,{ where: {id: pId} } 
    ).then(()=> {
    res.status(200).send("data updated");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.delete = (req, res) => {
  let pId = req.params.id;
  
  models.Document_Product_List.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Document_Product_List.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
