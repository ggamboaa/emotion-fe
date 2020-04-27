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
    models.Reservation.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Employee, as: 'employee'
      },{
        model: models.Vehicle, as: 'vehicle'
      }],
      where: { [Op.or]: 
        [{id: {[Op.like]:'%'+filter+'%'}}, {date: {[Op.like]:'%'+filter+'%'}}, {startDate: {[Op.like]:'%'+filter+'%'}}, {endDate: {[Op.like]:'%'+filter+'%'}}, 
        {employeeId: {[Op.like]:'%'+filter+'%' }}, {vehicleId: {[Op.like]:'%'+filter+'%' }}] 
      }
    })
    .then(reservations => {
      res.status(200).json({'records': reservations.rows, 'totalRecords':reservations.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Reservation.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Employee, as: 'employee'
      },{
        model: models.Vehicle, as: 'vehicle'
      }]
    })
    .then(reservations => {
      let pages = Math.ceil(reservations.count / limit);  
      res.status(200).json({'records': reservations.rows, 'totalRecords':reservations.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.findByPk = async (req, res) => {
  let id = req.params.id;
 
  const reservation = await models.Reservation.findByPk(id, {
    include: [{
      model: models.Employee, as: 'employee'
    },{
      model: models.Vehicle, as: 'vehicle'
    }]
  })
  .then(reservation => {
    res.json(reservation);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = async (req, res) => {
  let pVehicleId = req.body.vehicleId;
  let pStartDate = req.body.startDate;
  let pEndDate = req.body.endDate;

  const found = await models.Reservation.findAll({
    attributes: ['id'],
    where:  { 
      [Op.or]: [{ 
          [Op.and]: [{vehicleId: pVehicleId}, {startDate: {[Op.lte]: pStartDate}}, {endDate: {[Op.gte]:pEndDate}}] 
        },{ 
          [Op.and]: [{vehicleId: pVehicleId}, {startDate: {[Op.gte]: pStartDate}}, {startDate: {[Op.lte]:pEndDate}}]
        },{ 
          [Op.and]: [{vehicleId: pVehicleId}, {endDate: {[Op.gte]: pStartDate}}, {endDate: {[Op.lte]:pEndDate}}]  
      }]
    }      
  })
  .then((reservations) => {
    return reservations;
  })

  if(found.length == 0){
    models.Reservation.create(req.body)
    .then((reservation) => {
      res.send(reservation);
      res.status(200).send("data created");
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
  }else{
    var nothing = {}
    res.send(nothing);
  }
}

exports.update = async (req, res) => {
  let pId = req.params.id;
  let pVehicleId = req.body.vehicleId;
  let pStartDate = req.body.startDate;
  let pEndDate = req.body.endDate;

  const found = await models.Reservation.findAll({
    attributes: ['id'],
    where:  { 
      [Op.or]: [{ 
          [Op.and]: [{vehicleId: pVehicleId}, {startDate: {[Op.lte]: pStartDate}}, {endDate: {[Op.gte]:pEndDate}}] 
        },{ 
          [Op.and]: [{vehicleId: pVehicleId}, {startDate: {[Op.gte]: pStartDate}}, {startDate: {[Op.lte]:pEndDate}}]
        },{ 
          [Op.and]: [{vehicleId: pVehicleId}, {endDate: {[Op.gte]: pStartDate}}, {endDate: {[Op.lte]:pEndDate}}]  
      }]
    }      
  })
  .then((reservations) => {
    return reservations;
  })

  if(found.length == 0 || (found.length == 1 && found[0].id == pId)){
    models.Reservation.update(req.body,{ where: {id: pId} })
    .then(()=> {
      var something = {id:pId};
      res.send(something);
      res.status(200).send("data updated");
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
  }else{
    var nothing = {}
    res.send(nothing);
  }
}

exports.delete = (req, res) => {
  let pId = req.params.id;
  
  models.Reservation.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Reservation.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
