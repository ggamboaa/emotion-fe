'use strict';

const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAll = (req, res) => {
  // let limit = 5;
  // let page = 0;
  // let direction = 'DESC';
  // let sort = 'id';
  // let filter = null;
  
  // if(req.query.filter){
  //   filter = req.query.filter; 
  // }
  // if(req.query.pagesize){
  //   limit = parseInt(req.query.pagesize); 
  // }
  // if(req.query.page){
  //   page = parseInt(req.query.page);      
  // }
  // if(req.query.direction){
  //   direction = req.query.direction;
  // }
  // if(req.query.sort){
  //   sort = req.query.sort;
  // }
  
  // let offset = page * limit;

  // if(filter){
  //   models.Repair_Detail.findAndCountAll({
  //     limit: limit,
  //     offset: offset,
  //     include: [{
  //       model: models.Vehicle
  //     }],
  //     order: [[sort, direction]],
  //     where: {
  //       [Op.or]: 
  //         [{user: {[Op.like]:'%'+filter+'%' }},{date: {[Op.like]:'%'+filter+'%' }}]
  //     }
  //   })
  //   .then(Repair_Details => {
  //     res.status(200).json({'records': Repair_Details.rows, 'totalRecords':Repair_Details.count, 'numberOfPageRecords': limit});
  //   })
  //   .catch(error => {
  //     res.status(404).send('Internal Server Error:' + error);
  //   });
  // }else{
    models.Repair_Detail.findAndCountAll(
    {
      // limit: limit,
      // offset: offset,
      // include: [{
      //   model: models.Vehicle
      // }],
      // order: [[sort, direction]]
    })
    .then(Repair_Details => {
      let pages = Math.ceil(Repair_Details.count / limit);  
      res.status(200).json({'records': Repair_Details.rows /*, 'totalRecords':Repair_Details.count, 'totalPages': pages,
        'numberOfPageRecords': limit*/ });
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  // }
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Repair_Detail.findByPk(id, {
    include: [{
      model: models.Vehicle
    }]
  })
  .then(repair_detail => {
    res.json(repair_detail);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  let ids = req.body.ids;
  
  models.Repair_Detail.create(req.body)
  .then((repair_detail) => {
    //repair_detail.addVehicle(ids)
    res.status(200).send("data inserted");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Repair_Detail.update(req.body,{ where: {id: pId} } 
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
  
  models.Repair_Detail.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Repair_Detail.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
