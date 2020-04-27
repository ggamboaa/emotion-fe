'use strict';

const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.General_Register.findByPk(id, {
    include: [{
      model: models.Document, as: 'document'
    }] 
  })
  .then(General_Register => {
    res.json(General_Register);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.General_Register.create(req.body)
    .then((General_Register) => {
      res.send(General_Register);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.General_Register.update(req.body,{ where: {id: pId} } )
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
  
  models.General_Register.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.General_Register.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};