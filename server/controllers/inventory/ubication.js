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
    models.Ubication.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Rack
      },{
        model: models.Position
      },{
        model: models.Level
      },{
        model: models.Warehouse
      },{
        model: models.Ubication_Product_List,
        include: [{
          model: models.Product,
          include: [{
            //model: models.Document_Product_List,
            //include: [{
              model: models.Document  
            //}]  
          }] 
        }] 
      }],
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{ubicationName: {[Op.like]:'%'+filter+'%' }}, {warehouseId: {[Op.like]:'%'+filter+'%' }}] 
      }
    })
    .then(ubications => {
      res.status(200).json({'records': ubications.rows, 'totalRecords':ubications.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
  models.Ubication.findAndCountAll({
    limit: limit,
    offset: offset,
    include: [{
      model: models.Rack
    },{
      model: models.Position
    },{
      model: models.Level
    },{
      model: models.Warehouse
    },{
      model: models.Ubication_Product_List,
      include: [{
        model: models.Product,
        include: [{
          //model: models.Document_Product_List,
          //include: [{
            model: models.Document  
          //}]  
        }] 
      }] 
    }],
    order: [[sort, direction]]
  })
  .then(ubications => {
      let pages = Math.ceil(ubications.count / limit);  
      res.status(200).json({'records': ubications.rows, 'totalRecords':ubications.count, 'totalPages': pages, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
};

exports.findByWarehouseId = (req, res) => {
  let pId = req.params.id;
  let pStatus = true;
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let filter = null;
  
  if(req.query.filter){
    filter = req.query.filter; 
  }
  if(req.query.status){
    pStatus = req.query.status; 
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
    models.Ubication.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Warehouse
      }],
      order: [[sort, direction]],
      where: {
        [Op.and]: [{warehouseId: pId}, {ubicationName: {[Op.like]:'%'+filter+'%'}}, {status: pStatus}] 
      }
    })
    .then(ubications => {
      res.status(200).json({'records': ubications.rows, 'totalRecords':ubications.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Ubication.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Warehouse
      }],
      order: [[sort, direction]],
      where: {[Op.and]: [{warehouseId: pId}, {status: pStatus}] }
    })
    .then(ubications => {
      let pages = Math.ceil(ubications.count / limit); 
      res.status(200).json({'records': ubications.rows, 'totalRecords':ubications.count, 
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }

};

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Ubication.findByPk(id, {
    include: [{
      model: models.Rack
    },{
      model: models.Position
    },{
      model: models.Level
    },{
      model: models.Warehouse
    },{
      model: models.Ubication_Product_List,
      include: [{
        model: models.Product,
        include: [{
          //model: models.Document_Product_List,
          //include: [{
            model: models.Document  
          //}]  
        }] 
      }] 
    }]
  })
  .then(ubication => {
    res.json(ubication);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
};

exports.create = (req, res) => {
  models.Ubication.create(req.body)
    .then((ubication) => {
      res.send(ubication);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.delete = (req, res) => {
  let pId = req.params.id;
  
  models.Ubication.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Ubication.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("data updated");
   });
};