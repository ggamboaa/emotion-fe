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
  let WarehouseId = null;

  var productIds = [];
  
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
  if(req.query.WarehouseId){
    WarehouseId = req.query.WarehouseId;
  }
  
  let offset = page * limit;

  if(filter){
    models.Reorder_Point.findAll({ where: {WarehouseId: WarehouseId} })
    .then(data =>{

      for(var i in data){
        productIds.push(data[i].ProductId);
      }
       models.Ubication_Product_List.findAndCountAll({
        attributes: [
        'ProductId',
        [Sequelize.fn('sum', Sequelize.col('Ubication_Product_List.quantity')), 'maximum']
        ],
        group: [
        'ProductId'
        ],
        limit: limit,
        offset: offset,
        include: [{
          model: models.Product,
          include: [{
            model: models.Reorder_Point
          }],
           where: { [Op.or]: 
            [{id: {[Op.like]:'%'+filter+'%'}}, {name: {[Op.like]:'%'+filter+'%'}}, {code: {[Op.like]:'%'+filter+'%'}}] 
          }
        },
        {
          model: models.Ubication,
          where: { 
            [Op.or]: [ {[Op.and]: [{WarehouseId: WarehouseId },  {status: 1}]}, {[Op.and]: [{WarehouseId: WarehouseId }, {ubicationName: 'RTPTLT'}]} ]
          }
        }
        ],
        order: [[sort, direction]],
        where: {status: 1, ProductId: {[Op.in]: productIds} }
        })
       .then(upl => {
          let pages = Math.ceil(upl.count.length / limit);  
          res.status(200).json({'records': upl.rows, 'totalRecords':upl.count.length, 'totalPages': pages,
            'numberOfPageRecords': limit});
        })
      })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{   

    models.Reorder_Point.findAll({ where: {WarehouseId: WarehouseId} })
    .then(data =>{
      

      for(var i in data){
        productIds.push(data[i].ProductId);
      }
       models.Ubication_Product_List.findAndCountAll({
        attributes: [
        'ProductId',
        [Sequelize.fn('sum', Sequelize.col('Ubication_Product_List.quantity')), 'maximum']
        ],
        group: [
        'ProductId'
        ],
        limit: limit,
        offset: offset,
        include: [{
          model: models.Product,
          include: [{
            model: models.Reorder_Point
          }]
        },
        {
          model: models.Ubication,
          where: { 
            [Op.or]: [ {[Op.and]: [{WarehouseId: WarehouseId },  {status: 1}]}, {[Op.and]: [{WarehouseId: WarehouseId }, {ubicationName: 'RTPTLT'}]} ]
          }
        }
        ],
        order: [[sort, direction]],
        where: {status: 1, ProductId: {[Op.in]: productIds} }
        })
       .then(upl => {
          let pages = Math.ceil(upl.count.length / limit);  
          res.status(200).json({'records': upl.rows, 'totalRecords':upl.count.length, 'totalPages': pages,
            'numberOfPageRecords': limit});
        })
      })
      .catch(error => {
        res.status(404).send('Internal Server Error:' + error);
      });
  }
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Reorder_Point.findByPk(id, {
    include: [{
      model: models.Product
    }]
  })
  .then(Reorder_Point => {
    res.json(Reorder_Point);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.Reorder_Point.create(req.body)
    .then((Reorder_Point) => {
      res.send(Reorder_Point);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Reorder_Point.update(req.body,{ where: {id: pId} } 
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
  
  models.Reorder_Point.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Reorder_Point.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("data updated");
   });
};
