'use strict';

const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAll = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let status = [1,2,3,4,5];
 
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

  if(req.query.status == 1){
    status = [1];
  }
  if(req.query.status == 2){
    status = [2];
  }
  if(req.query.status == 3){
    status = [3];
  }
  if(req.query.status == 4){
    status = [4];
  }
  if(req.query.status == 5){
    status = [5];
  }
  
  let offset = page * limit;

  models.Tracking.findAndCountAll({
    limit: limit,
    offset: offset,
    order: [[sort, direction]],
    include: [{
      model: models.Document, as: 'document'
    }], 
    where: { status: {[Op.in]: status} }
  })
  .then(trackings => {
    res.status(200).json({'records': trackings.rows, 'totalRecords':trackings.count, 'numberOfPageRecords': limit});
  })
  .catch(error => {
    res.status(404).send('Internal Server Error:' + error);
  });
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Tracking.findByPk(id, {
    include: [{
      model: models.Document, as: 'document'
    }] 
  })
  .then(Tracking => {
    res.json(Tracking);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.Tracking.create(req.body)
    .then((tracking) => {
      res.send(tracking);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Tracking.update(req.body,{ where: {id: pId} } )
  .then(()=> {
    res.status(200).send("data updated");
	})
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.delete = (req, res) => {
  let pId = req.params.id;
  
  models.Tracking.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Tracking.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};