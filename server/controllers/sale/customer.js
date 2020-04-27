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
    models.Customer.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: models.Warehouse, as: "warehouse",
      }],
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{identification: {[Op.like]:'%'+filter+'%'}}, {name: {[Op.like]:'%'+filter+'%' }}, {firstName: {[Op.like]:'%'+filter+'%' }}
        , {lastName: {[Op.like]:'%'+filter+'%' }}, {email: {[Op.like]:'%'+filter+'%' }}] 
      }
    })
    .then(customers => {
      res.status(200).json({'records': customers.rows, 'totalRecords':customers.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Customer.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: models.Warehouse, as: "warehouse",
      }],
      order: [[sort, direction]]
    })
    .then(customers => {
      let pages = Math.ceil(customers.count / limit);  
      res.status(200).json({'records': customers.rows, 'totalRecords':customers.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Customer.findByPk(id, {
    include: [{
      model: models.Warehouse, as: "warehouse",
    }]
  })
  .then(customer => {
    res.json(customer);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.Customer.create(req.body)
    .then((customer) => {
      res.send(customer);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Customer.update(req.body,{ where: {id: pId} } 
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
  
  models.Customer.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted a user with id = ' + pId);
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Customer.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("data updated a deparment with id = " + id);
   });
};
