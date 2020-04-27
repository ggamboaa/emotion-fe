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
    models.User.findAndCountAll({
      //attributes: ['id', 'first_name', 'last_name', 'date_of_birth'],
      limit: limit,
      offset: offset,
      include: [{
        model: models.Rol
      },{
        model: models.Employee, as: "employee",
        include: [{
          model: models.Warehouse
        }]
      }],
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{user: {[Op.like]:'%'+filter+'%'}}] 
      }
    })
    .then(users => {
      let pages = Math.ceil(users.count / limit);
      res.status(200).json({'records': users.rows, 'totalRecords':users.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.User.findAndCountAll({
    //attributes: ['id', 'first_name', 'last_name', 'date_of_birth'],
      limit: limit,
      offset: offset,
      include: [{
        model: models.Rol
      },{
        model: models.Employee, as: "employee"
      }],
      order: [[sort, direction]]
    })
    .then(users => {
      let pages = Math.ceil(users.count / limit);
      res.status(200).json({'records': users.rows, 'totalRecords':users.count, 'totalPages': pages,
          'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
};

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.User.findByPk(id, {
    include: [{
      model: models.Rol
    },{
      model: models.Employee, as: "employee"
    }]
  })
  .then(users => {
    res.json(users);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {  
  let ids = req.body.ids;

  models.User.create(req.body)
    .then((users) => {
      users.setRols(ids)
      res.status(200).send("data inserted");
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = async (req, res) => {
  let pId = req.params.id;
  let ids = req.body.ids;

  const us = await models.User.findByPk(pId);
  
  us.update(req.body) 
  .then((users) => {
    users.setRols(ids)
    res.status(200).send("data updated");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.delete = (req, res) => {
  let id = req.params.id;
  
  models.User.destroy({where: { id: id }})
  .then(() => {
    res.status(200).send('data deleted a user with id = ' + id);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
};

exports.login = (req, res) => {
  const vUser = req.body.user;
  const vPassword = req.body.password;
  
  models.User.findAll({
    include: [{
      model: models.Rol
    }],
    where: { 
      [Op.and]: [{user: vUser}, {password: vPassword}]
    }
  })
  .then(users => {
    res.json(users);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}  

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.User.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("data updated a user with id = " + id);
   })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
};

