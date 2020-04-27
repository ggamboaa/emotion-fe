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
    models.Vehicle.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{licensePlate: {[Op.like]:'%'+filter+'%'}}, {brand: {[Op.like]:'%'+filter+'%' }}, {transmissionType: {[Op.like]:'%'+filter+'%' }}] 
      }
    })
    .then(vehicles => {
      res.status(200).json({'records': vehicles.rows, 'totalRecords':vehicles.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Vehicle.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]]
    })
    .then(vehicles => {
      let pages = Math.ceil(vehicles.count / limit);  
      res.status(200).json({'records': vehicles.rows, 'totalRecords':vehicles.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Vehicle.findByPk(id, {})
  .then(vehicle => {
    res.json(vehicle);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.Vehicle.create(req.body)
    .then((vehicle) => {
      res.send(vehicle);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Vehicle.update(req.body,{ where: {id: pId} } 
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
  
  models.Vehicle.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Vehicle.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
