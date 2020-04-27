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
    models.Employee.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Warehouse
      },{
        model: models.Department, as: 'department'
      },{
        model: models.Job_Position, as: 'jobPosition'
      }],
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{identification: {[Op.like]:'%'+filter+'%'}}, {name: {[Op.like]:'%'+filter+'%' }}, {firstName: {[Op.like]:'%'+filter+'%' }}
        ,{lastName: {[Op.like]:'%'+filter+'%' }}, {phone1: {[Op.like]:'%'+filter+'%' }}, {email: {[Op.like]:'%'+filter+'%' }}] 
      }
    })
    .then(employees => {
      res.status(200).json({'records': employees.rows, 'totalRecords':employees.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
  models.Employee.findAndCountAll({
    //attributes: ['id', 'first_name', 'last_name', 'date_of_birth'],
    limit: limit,
    offset: offset,
    include: [{
      model: models.Warehouse
    },{
      model: models.Department, as: 'department'
    },{
      model: models.Job_Position, as: 'jobPosition'
    }],
    order: [[sort, direction]]
  })
  .then(employees => {
    let pages = Math.ceil(employees.count / limit);  
    res.status(200).json({'records': employees.rows, 'totalRecords':employees.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
};

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Employee.findByPk(id, {
    include: [{
      model: models.Warehouse
    },{
      model: models.Department, as: 'department'
    },{
      model: models.Job_Position, as: 'jobPosition'
    }]
  })
  .then(employee => {
    res.json(employee);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  let ids = req.body.warehouseIds;

  models.Employee.create(req.body)
  .then((employee) => {
    employee.setWarehouses(ids)
    res.status(200).send("data inserted");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
} 

exports.update = async (req, res) => {
  let pId = req.params.id;
  let ids = req.body.warehouseIds;

  const emp = await models.Employee.findByPk(pId);
  
  emp.update(req.body,{ where: {id: pId} })
  .then((employee) => {
    employee.setWarehouses(ids)
    res.status(200).send("data updated");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.delete = (req, res) => {
  let id = req.params.id;
  
  models.Employee.destroy({where: { id: id }})
  .then(() => {
    res.status(200).send('data deleted a employee with id = ' + id);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Employee.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("data updated a deparment with id = " + id);
   });
};
