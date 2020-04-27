'use strict';

const models = require('../../models/db');
const mySequelize = require('sequelize');
const Op = mySequelize.Op;

exports.getAll = async (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let filter, pWarehouseId = null;
  let status = 1;
  // let typeDoc = 6;
  let pUbicationId = 0;
  
  if(req.query.filter){
    filter = req.query.filter; 
  }
  if(req.query.WarehouseId){
    pWarehouseId = req.query.WarehouseId; 
  }
  if(req.query.status){
    status = req.query.status; 
  }
  // if(req.query.typeDoc){
  //   typeDoc = req.query.typeDoc; 
  // }

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

  const Ubication = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: pWarehouseId}, {ubicationName: 'RRPRLR'}  ] } })
  .then((ubi) =>{
    pUbicationId = ubi[0].id;
  })

  if(filter){
    models.Document.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{  
        model: models.Product,
          include: [{
          model: models.Ubication_Product_List,
          // where: {WarehouseId: pWarehouseId},
          where:{ [Op.and]: [{WarehouseId: pWarehouseId} , {UbicationId: pUbicationId}] },
          include: [{
            model: models.Ubication
          }]  
        }] 
      },{model: models.Type_Document},{model: models.Document_Detail}], 
      where: { [Op.or]: [{id: {[Op.like]:'%'+filter+'%'}}, {user: {[Op.like]:'%'+filter+'%'}}, {comment: {[Op.like]:'%'+filter+'%' }}],
              status: {[Op.in]: [status]}/*, [Op.and]: [{WarehouseId: pWarehouseId} , {TypeDocumentId: typeDoc}]*/ }
    })
    .then(documents => {
      res.status(200).json({'records': documents.rows, 'totalRecords':documents.rows.length, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Document.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{  
        model: models.Product,
        include: [{
          model: models.Ubication_Product_List,
          // where: {WarehouseId: pWarehouseId},
          where:{ [Op.and]: [{WarehouseId: pWarehouseId} , {UbicationId: pUbicationId}] },
          include: [{
            model: models.Ubication
          }]  
        }] 
      },{model: models.Type_Document},{model: models.Document_Detail}],
      where: { status: {[Op.in]: [status]}/*, [Op.and]: [{WarehouseId: pWarehouseId}/*, {TypeDocumentId: typeDoc}]*/ }
    })
    .then(documents => {
      let pages = Math.ceil(documents.count / limit); 
      console.log(documents);
      res.status(200).json({'records': documents.rows, 'totalRecords':documents.rows.length, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.getProducts = (req, res) =>{
  var id = req.params.id;

  models.Ubication_Product_List.findAll({
    include: [{
        model: models.Product,
      },
      {
        model: models.Ubication
      }],
    where:{ DocumentId: id }})
  .then(products => {
    // res.json(products);
     res.status(200).json({'records': products});
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.update = (req, res) => {
  let pId = req.body.id;
  let pSave = req.body.storeSave;
  let pUpdate = req.body.storeUpdate;
  let pDelete = req.body.storeDelete;

  setTimeout(async(ress) =>{
  const store = await models.Ubication_Product_List.findByPk(pId)
    .then((av) =>{
      if(pSave.length > 0){
        console.log(pSave);
        models.Ubication_Product_List.create(pSave[0]);
      }
      if(pUpdate.length > 0){
        console.log(pUpdate);
        models.Ubication_Product_List.update(pUpdate[0] , { where: {id: pUpdate[0].id} });
      }
      if(pDelete.length > 0){
        console.log(pDelete);
        models.Ubication_Product_List.destroy({where: { id: pDelete[0].id }})
      }
      res.status(200).send("data updated");
    })
  }, 1000);
}