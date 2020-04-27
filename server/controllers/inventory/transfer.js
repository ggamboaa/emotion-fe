'use strict';

const models = require('../../models/db');
const mySequelize = require('sequelize');
const Op = mySequelize.Op;

exports.getAll = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let pWarehouseId = null;
  let filter = null;

  var idDocs = [];
  var docs = [];

  if(req.query.filter){
    filter = req.query.filter; 
  }
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
  
  let offset = page * limit;

  if(filter){
    models.Ubication_Product_List.findAll({
      attributes: ['DocumentId'],
      group: ['DocumentId'],
      include: [
      {
        model: models.Ubication,
        attributes: [ 'ubicationName' ],
        where: {
          [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RDPDLD'}]
        }
      }]
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
        include: [ { model: models.Type_Document, as: 'Type_Document'},{ model: models.Document_Detail}],
        where: { 
          [Op.and]: [{id:{ [Op.in]: idDocs}},{code: {[Op.like]:'%'+filter+'%'}}] 
        }
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
  }
  else{
    models.Ubication_Product_List.findAll({
      attributes: ['DocumentId'],
      group: ['DocumentId'],
      include: [
      {
        model: models.Ubication,
        attributes: [ 'ubicationName' ],
        where: {
          [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RDPDLD'}]
        }
      }]
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
        include: [ { model: models.Type_Document, as: 'Type_Document'},{ model: models.Document_Detail}],
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
  }

  
}; 

exports.getReceiptTransfer = async (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let pWarehouseId = null;
  let filter = null;

  var idDocs = [];
  var docs = [];

  if(req.query.filter){
    filter = req.query.filter; 
  }
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
  console.log('Estoy en el metodo correcto');
  let offset = page * limit;
  if(filter){
    console.log('Aplicando filtro');
    /////////////////
    models.Ubication_Product_List.findAll({
      attributes: ['DocumentId'],
      group: ['DocumentId'],
      include: [
      {
        model: models.Ubication,
        attributes: [ 'ubicationName' ],
        where: {
          [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RUPULU'}]}
        }]
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
        include: [ { model: models.Type_Document, as: 'Type_Document'},{ model: models.Document_Detail}],
        where: {
         [Op.and]: [{id:{ [Op.in]: idDocs}},{code: {[Op.like]:'%'+filter+'%'}}]
       }

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
    /////////////////
  }
  else{
    console.log('No lo estoy aplicando');
    models.Ubication_Product_List.findAll({
      attributes: ['DocumentId'],
      group: ['DocumentId'],
      include: [
      {
        model: models.Ubication,
        attributes: [ 'ubicationName' ],
        where: {
          [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RUPULU'}]}
        }]
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
        include: [ { model: models.Type_Document, as: 'Type_Document'},{ model: models.Document_Detail}],
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
  }

};


exports.getProducts = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let filter = null;
  let warehouseId = 0;
  
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
  if(req.query.warehouseId){
    warehouseId = req.query.warehouseId;
  }
  
  
  let offset = page * limit;

  if(filter){
    models.Ubication_Product_List.findAndCountAll({
      attributes: [
      'ProductId',
      [mySequelize.fn('sum', mySequelize.col('Ubication_Product_List.quantity')), 'maximum']
      ],
      group: [
      'ProductId'
      ],
      limit: limit,
      offset: offset,
      include: [{
        model: models.Product,
        where: { [Op.or]: 
          [{code: {[Op.like]:'%'+filter+'%'}}, {name: {[Op.like]:'%'+filter+'%'}}, {description: {[Op.like]:'%'+filter+'%'}}, {typeProduct: {[Op.like]:'%'+filter+'%' }}, {brandId: {[Op.like]:'%'+filter+'%' }}, 
          {measure: {[Op.like]:'%'+filter+'%' }}]
        }
      },
      {
        model: models.Ubication,
        where: { 
          [Op.or]: [ {[Op.and]: [{WarehouseId: warehouseId },  {status: 1}]}, {[Op.and]: [{WarehouseId: warehouseId }, {ubicationName: 'RTPTLT'}]},
          {[Op.and]: [{WarehouseId: warehouseId }, {ubicationName: 'RAPALA'}]}]
          // [Op.and]: [{WarehouseId: warehouseId }] 
        }
      }
      ],
      order: [[sort, direction]],
      where: {status: 1}
    })
    .then(products => {
      res.status(200).json({'records': products.rows, 'totalRecords':products.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Ubication_Product_List.findAndCountAll({
      attributes: [
      'ProductId',
      [mySequelize.fn('sum', mySequelize.col('Ubication_Product_List.quantity')), 'maximum']
      ],
      group: [
      'ProductId'
      ],
      limit: limit,
      offset: offset,
      include: [{
        model: models.Product
      },
      {
        model: models.Ubication,
        where: { 
          [Op.or]: [ {[Op.and]: [{WarehouseId: warehouseId },  {status: 1}]}, {[Op.and]: [{WarehouseId: warehouseId }, {ubicationName: 'RTPTLT'}]},
          {[Op.and]: [{WarehouseId: warehouseId }, {ubicationName: 'RAPALA'}]}]
          // [Op.and]: [{WarehouseId: warehouseId }] 
        }
      }
      ],
      order: [[sort, direction]],
      where: {status: 1}
    })
    .then(products => {
      let pages = Math.ceil(products.count / limit);  
      res.status(200).json({'records': products.rows, 'totalRecords':products.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
};

exports.create = async (req, res) => {
  var ids = req.body.ids;
  var quantitys = req.body.quantitys;
  var warehouseId = req.body.WarehouseId;
  var productsDetailList = req.body.productsDetailList;

  const nextDocCode = await models.General_Configuration.findAll({
    attributes: ['nextDocCode'],
    where: { id: 1 }
  })
  .then((genConf) => {
    return genConf;
  })

  //for(var i in nextDocCode) {
  req.body.code = nextDocCode[0].nextDocCode;
  //}

  const Ubication = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: warehouseId}, {ubicationName: 'RTPTLT'}  ] } })
  .then((ubi) =>{

    models.Document.create(req.body)
    .then((doc) => {
      var docDetail = { DocumentId: doc.id, WarehouseOrigin: req.body.warehouseOrigin.id, WarehouseDestination: req.body.warehouseDestination.id };
     
      models.Document_Detail.create(docDetail);
      models.General_Configuration.update({ nextDocCode: parseInt(req.body.code) + 1 }, { where: {id: 1} });

      for(var i in productsDetailList){
        var newObject = {};
        newObject.DocumentId = doc.id;
        newObject.UbicationId = ubi[0].id;
        newObject.WarehouseId = warehouseId;
        newObject.ProductId = productsDetailList[i].product.id;
        newObject.quantity = productsDetailList[i].quantity * -1;
        newObject.user = req.body.user;
        newObject.status = 1;

        models.Ubication_Product_List.create(newObject);
      }

      for(var i in ids){
        doc.setProducts(ids[i], { through: { quantity: quantitys[i], status: true, WarehouseId: warehouseId } });      
      }
    })
    

    res.status(200).send("data D-P inserted");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.receiptProducts = async (req, res) => {

 const Ubication = await models.Ubication.findAll({ 
  where: { [Op.and]:[ {WarehouseId: req.body.warehouseDestination.id}, {ubicationName: 'RRPRLR'}  ] } })
 .then((ubi) =>{
  for(var i in req.body.Products){
    for(var j in req.body.Products[i].Ubication_Product_Lists){
      if(req.body.id == req.body.Products[i].Ubication_Product_Lists[j].DocumentId){
        models.Ubication_Product_List.update({ UbicationId: ubi[0].id, status: 0 }, { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} })
      }
   }
 }
 res.status(200).send("data send");
})
 .catch(error => {
   console.log(error);
   res.status(404).send(error);
 })
}

exports.sendProducts =  (req, res) => {
  var ubiDestinaton = 0;

  models.Document.update({WarehouseId: req.body.warehouseDestination.id , status: 0}, { where: {id: req.body.id} });

  models.Ubication.findAll({  where: { [Op.and]: 
    [ {WarehouseId: req.body.warehouseOrigin.id}, {ubicationName: 'RDPDLD'}  ] } })
  .then(async(ubiOrigin) => {

    if(req.body.transfer.Document_Detail.typeSaleOrder == 2){
      //Ubicación para Pedidos de Mayoreo
      ubiDestinaton = await models.Ubication.findAll({ where: { [Op.and]: 
        [ {WarehouseId: req.body.warehouseDestination.id}, {ubicationName: 'RWPWLW'}  ] } });
    }
    else{
      //Traslado común
      ubiDestinaton = await models.Ubication.findAll({ where: { [Op.and]: 
        [ {WarehouseId: req.body.warehouseDestination.id}, {ubicationName: 'RUPULU'}  ] } });

    }
    for(var i in req.body.Products){
      for(var j in req.body.Products[i].Ubication_Product_Lists){
        //Compara entre Document y UPL por DocumentId
        if(req.body.id == req.body.Products[i].Ubication_Product_Lists[j].DocumentId){
          //Pregunta en UPL si el producto se encuentra en RDPDLD de la Bodega Origigen
          if(ubiOrigin[0].id == req.body.Products[i].Ubication_Product_Lists[j].UbicationId){
            //Si es así hace el update de UPL donde cambiara el UbicationId, WarehouseId
            models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0, WarehouseId: req.body.warehouseDestination.id },
              { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
          }
        }
      }
    }

    //Actualiza estado = 3 del Doc en el Tracking...
    models.Tracking.update({ status: 3 }, { where: {documentId:req.body.id} })
    
    //Registra el movimiento en GeneralRegister...
    var doc = {documentId: req.body.id, status:3};  
    models.General_Register.create(doc)

    res.status(200).send("data send");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

// exports.sendProducts = async (req, res) => {

//   models.Document.update({WarehouseId: req.body.warehouseDestination.id}, { where: {id: req.body.id} });

//   const Ubication = await models.Ubication.findAll({ where: { [Op.and]: 
//     [ {WarehouseId: req.body.warehouseDestination.id}, {ubicationName: 'RUPULU'}  ] } })
//   .then((ubiDestinaton) =>{

//     models.Ubication.findAll({  where: { [Op.and]: 
//       [ {WarehouseId: req.body.warehouseOrigin.id}, {ubicationName: 'RDPDLD'}  ] } })
//     .then((ubiOrigin) =>{

//       console.log(req.body.transfer.Document_Detail.typeSaleOrder);
//       if(req.body.transfer.Document_Detail.typeSaleOrder == 2){
//         console.log('Hace lo que le da la gana');


//       }
//       else{
//         console.log('Hace lo que le pido');
//         for(var i in req.body.Products){
//           for(var j in req.body.Products[i].Ubication_Product_Lists){
//             //Compara entre Document y UPL por DocumentId
//             if(req.body.id == req.body.Products[i].Ubication_Product_Lists[j].DocumentId){
//               //Pregunta en UPL si el producto se encuentra en RDPDLD de la Bodega Origigen
//               if(ubiOrigin[0].id == req.body.Products[i].Ubication_Product_Lists[j].UbicationId){
//                 //Si es así hace el update de UPL donde cambiara el UbicationId, WarehouseId
//                 models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0, WarehouseId: req.body.warehouseDestination.id },
//                   { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
//               }
//             }
//           }
//         }
//       }
      
//     })
//     res.status(200).send("data send");
//   })
//   .catch(error => {
//     console.log(error);
//     res.status(404).send(error);
//   })
// }
