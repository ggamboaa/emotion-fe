'use strict';

const models = require('../../models/db');
const mySequelize = require('sequelize');
const Op = mySequelize.Op;

exports.getAll = async (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let pWarehouseId = null;

  var store = {};
  var idDocs = [];
  var docs = [];

  if(req.query.WarehouseId){
    pWarehouseId = req.query.WarehouseId; 
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

  models.Ubication_Product_List.findAll({
  attributes: [
  'DocumentId'
  ],
  group: [
  'DocumentId'
  ],
  include: [
  {
    model: models.Ubication,
    attributes: [ 'ubicationName' ],
    where: {
    [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RAPALA'}]}
  }
  ]
  })
  .then((av) =>{
    if(av.length > 0){
      for(var i in av){
        idDocs.push(av[i].DocumentId);
      } 
    }
    
    models.Document.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [ { model: models.Type_Document, as: 'Type_Document'}],
      where: { id:{ [Op.in]: idDocs} }
    })
    .then(documents =>{
      let pages = Math.ceil(documents.count / limit);  
      res.status(200).json({'records': documents.rows, 'totalRecords':documents.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
  })
    
  .catch(error => {
    res.status(404).send('Internal Server Error:' + error);
  });

};

//Obtiene los productos del Alisto pendiente
exports.getProducts = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let pDocumentId = 0;

  if(req.query.DocumentId){
    pDocumentId = req.query.DocumentId;
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
  console.log('*************************************************' )
  console.log('limite: ' + limit)

  models.Ubication_Product_List.findAndCountAll({
    limit: limit,
    offset: offset,
    order: [[sort, direction]],
    include: [{
        model: models.Product,
      },
      {
        model: models.Ubication,
        where:{ubicationName: 'RAPALA'}
      }],
    where:{ DocumentId: pDocumentId }})
  .then(products => {
    let pages = Math.ceil(products.count / limit);
     res.status(200).json({'records': products, 'totalRecords':products.count, 'totalPages': pages, 'numberOfPageRecords': limit});
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}; 


//Cancela el alisto del Documento
exports.cancelPrepareOrder = (req, res) =>{
  let rolCodes = ['01','06','08']
  let flag = false;

  models.User.findAll({
    include: [
    // {
    //   model: models.Rol_User_List
    // },
    {
      model: models.Rol,
      where:{ code:{[Op.in]:rolCodes}}
    }]
  })
  .then((users) =>{
    for(var i in users){
      console.log(users.length);
      console.log(users[i].password + ' '+ req.body.password);
      if(users[i].password == req.body.password){
        
        flag = true;
        
      }
    }
    if(flag){
      models.Ubication.findAll({ where:{ [Op.and]: [{ubicationName: 'RAPALA', WarehouseId: req.body.WarehouseId  }]} })
      .then((ubi) =>{
        models.Ubication_Product_List.findAll({ where:{  [Op.and]: [{UbicationId: ubi[0].id, 
        WarehouseId: req.body.WarehouseId,  DocumentId: req.body.id  }]}})
        .then((rows) =>{

          for(var i in rows){
             models.Ubication_Product_List.destroy({where: {id: rows[i].id } });
          }
          res.status(200).send("data updated");
        });

      });
    }else{
      var error = {};
      res.status(404).send(error);;
    }
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}


//Obtiene las ubicaciones con el producto elegido en alisto
exports.getInventoryProducts = (req, res) =>{
  var pId = req.query.ProductId;
  var wId = req.query.WarehouseId;

  models.Ubication_Product_List.findAll({
    include: [{
        model: models.Product,
      },
      {
        model: models.Ubication,
        where:{status: 1}
      }],
    where: {  [Op.and]: [{ProductId: pId, status: 1 , quantity: {[Op.gt]: 0}, WarehouseId: wId  }]}
  })
  .then(products => {
     res.status(200).json({'records': products});
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = async (req, res) => {
  var itemDetail = req.body.itemDetail;
  var selectedPrepareOrder = req.body.selectedPrepareOrder;
  var typeSaleOrder = 0;

  //Saldos en las ubicaciones de Inventario y RAPALA respectivamente
  var newQuantityUbication = itemDetail.quantity - itemDetail.newQuantity;             //Saldo Inventario
  var newQuantityPrepareOrder = selectedPrepareOrder.quantity + itemDetail.newQuantity // Saldo RAPALA

  const docDeta = await models.Document_Detail.findAll({where: {DocumentId: req.body.selectedPrepareOrder.DocumentId}})
  .then(async (documentDetail) =>{

    if(documentDetail.length > 0 ){
      typeSaleOrder = await documentDetail[0].typeSaleOrder;
      if(req.body.typeDocument == 5){
        // console.log('Es un typeDocument 5');
        // console.log('El typeSaleOrder es: ' + documentDetail[0].typeSaleOrder);
        if(documentDetail[0].typeSaleOrder == 2){
          // console.log('Es un tipo 2');
          models.Ubication_Product_List.findAll({ where:{ [Op.and]: [{UbicationId: req.body.selectedPrepareOrder.Ubication.id,
           WarehouseId: req.body.selectedPrepareOrder.WarehouseId, DocumentId: req.body.selectedPrepareOrder.DocumentId  }]} })
          .then((upls) =>{
            // console.log('Es arreglo tiene un length de: '+upls.length);
            if(upls.length == 1){
              if(newQuantityPrepareOrder ==  0){
                //Actualiza estado = 2 del Doc en el Tracking...
                models.Tracking.update({ status: 2 }, { where: {documentId:selectedPrepareOrder.DocumentId} })

                //Registra el movimiento en GeneralRegister...
                var doc = {documentId:selectedPrepareOrder.DocumentId, status:2};  
                models.General_Register.create(doc)
              }
            }

          });
        }
      }
    }
    
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })

  //Si no es una requisición solamente actualiza las cantidades de Inventario y RTPTLT
  // console.log(typeSaleOrder);
  if(req.body.typeDocument != 7 && typeSaleOrder != 1){
    console.log('Entro al metodo :(');
    //Objecto que se va actualizar o insertar en la Ubicación RDPDLD en el siguiente metodo
    var object = {};
    object.DocumentId = selectedPrepareOrder.DocumentId;
    object.UbicationId = 0;
    object.WarehouseId = itemDetail.WarehouseId;
    object.ProductId = itemDetail.ProductId;
    object.quantity = itemDetail.newQuantity;
    object.user = req.body.user;
    object.status = 1;

    //Pregunta si existe el producto en RDPDLD, si existe lo actualiza la cantidad sino crea la linea.
    models.Ubication.findAll({ where:{ [Op.and]: [{ubicationName: 'RDPDLD', WarehouseId: itemDetail.WarehouseId  }]} })
    .then((ubi) =>{
      object.UbicationId = ubi[0].id;
        models.Ubication_Product_List.findAll({ where:{  [Op.and]: [{UbicationId: object.UbicationId, 
        WarehouseId: itemDetail.WarehouseId, ProductId: object.ProductId, DocumentId: object.DocumentId  }]}})
        .then((getubi) =>{
          if(getubi.length > 0){
            var dQuantity = getubi[0].quantity + itemDetail.newQuantity;
            models.Ubication_Product_List.update({ quantity: dQuantity },{where: {id:getubi[0].id }});
          }
          else{
            models.Ubication_Product_List.create(object);
          }
        });
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
  }
  

  //Actualizar||Elimina la cantidad de la ubicación de Inventario
  if(newQuantityUbication > 0){
    models.Ubication_Product_List.update({ quantity: newQuantityUbication },{where: {id:itemDetail.id }} );
  }
  else{
    models.Ubication_Product_List.destroy({where: {id:itemDetail.id }});
  }

  //Actualizar||Elimina la cantidad de la ubicación RDPDLD
  if(newQuantityPrepareOrder < 0){
    models.Ubication_Product_List.update({ quantity: newQuantityPrepareOrder },{where: {id:selectedPrepareOrder.id }})
  }
  else{
    models.Ubication_Product_List.destroy({where: {id:selectedPrepareOrder.id }});
  }




  res.status(200).send("data updated");
}