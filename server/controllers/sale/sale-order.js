'use strict';

const models = require('../../models/db');
const mySequelize = require('sequelize');
const Op = mySequelize.Op;

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


exports.close = async (req, res) =>{
  let pId = req.body.id;
  let pStatus = req.body.status; 
  let rowInsert = req.body.rowInsert;
  let warehouseId = req.body.WarehouseId;

  const Ubication = await models.Ubication.findAll({ where: { [Op.and]: 
    [ {WarehouseId: warehouseId}, {ubicationName: 'RAPALA'}  ] } })
  .then((ubiA) =>{
    models.Ubication.findAll({ where: { [Op.and]: 
    [ {WarehouseId: warehouseId}, {ubicationName: 'RTPTLT'}  ] } })
    .then((ubiT) =>{
      models.Ubication_Product_List.findAll({ where: { [Op.and]: 
      [ { WarehouseId: warehouseId }, { UbicationId: ubiT[0].id },{DocumentId: rowInsert[0].DocumentId}  ]} })
      .then((array) =>{
        for( var i in array){
          models.Ubication_Product_List.update({UbicationId: ubiA[0].id},{where: { id: array[i].id }})
        }
      })
    })
    models.Document.update( { status: 2 }, { where: {id: pId} })
    
  
  //Ingresar Doc al Tracking...
  if(req.body.typeDocumentId == 5){
    console.log('Ingreso al metodo');
    var doc = {documentId:pId, status:1};  
    models.Tracking.create(doc)

    //Ingresar Doc a GeneralRegister...
    var doc = {documentId:pId, status:1};  
    models.General_Register.create(doc)
  }

  res.status(200).send(" data closed ");
  })  
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
};


exports.create = async (req, res) => {
  var ids = req.body.ids;
  var quantitys = req.body.quantitys;
  var WarehouseId = req.body.WarehouseId;
  var productsDetailList = req.body.productsDetailList;

  const nextDocCode = await models.General_Configuration.findAll({
    attributes: ['nextDocCode'],
    where: { id: 1 }
  })
  .then((genConf) => {
    return genConf;
  })

  req.body.code = nextDocCode[0].nextDocCode;

  const Ubication = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: WarehouseId}, {ubicationName: 'RTPTLT'}  ] } })
  .then((ubi) =>{

    models.Document.create(req.body)
    .then((doc) => {

      var docDetail = {};
      var flag = false;

      if(req.body.customerDup != null ){
        flag = true;
        docDetail.CustomerId = req.body.customerDup.id;
      }
      if(req.body.typeSaleOrderDup != null ){
        flag = true;
        docDetail.typeSaleOrder = req.body.typeSaleOrderDup.id;
      }

      if(flag != false ){
        docDetail.DocumentId = doc.id;
        if(docDetail.typeSaleOrder == 2){
          docDetail.WarehouseOrigin = req.body.WarehouseOrigin;
          docDetail.WarehouseDestination = 7; //Sucursal de Mayoreo
        }
        models.Document_Detail.create(docDetail);

      }

      for(var i in productsDetailList){
        var newObject = {};
        newObject.DocumentId = doc.id;
        newObject.UbicationId = ubi[0].id;
        newObject.WarehouseId = WarehouseId;
        newObject.ProductId = productsDetailList[i].product.id;
        newObject.quantity = productsDetailList[i].quantity * -1;
        newObject.user = req.body.user;
        newObject.status = 1;

        models.Ubication_Product_List.create(newObject);
      }

      for(var i in ids){
        doc.setProducts(ids[i], { through: { quantity: quantitys[i], status: true, WarehouseId: WarehouseId } });
        models.General_Configuration.update({ nextDocCode: parseInt(req.body.code) + 1 }, { where: {id: 1} });    
      }
    })
    

    res.status(200).send("data D-P inserted");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.update = async (req, res) => {
  let pId = req.params.id;
  let ids = req.body.ids;
  let quantitys = req.body.quantitys;
  let warehouseId = req.body.warehouseId;
  var rowFE = req.body.productsDetailList;

  const Ubication = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: req.body.warehouseId}, {ubicationName: 'RTPTLT'}  ] } })
    .then((ubi) =>{
      models.Ubication_Product_List.findAll({ where: { [Op.and]: 
      [ {WarehouseId: req.body.warehouseId}, {UbicationId: ubi[0].id }  ]} })
      .then((array) =>{
        //Update Document_Detail
        if(req.body.customerDup != null ){
          console.log(req.body.customerDup.id);
          console.log(array[0].DocumentId);
          // var docDetail = { DocumentId: req.body.id , CustomerId: req.body.customerDup.id };
          models.Document_Detail.update({ CustomerId: req.body.customerDup.id}, {where: {DocumentId: req.body.id}});
        }
        //UPDATE - DETELE
        for(var i in array){
          var flagDB = false;
          for( var j in rowFE){
            if(array[i].ProductId == rowFE[j].product.id){
              flagDB = true;
              if(array[i].quantity != rowFE[j].quantity*-1){
                models.Ubication_Product_List.update({quantity: rowFE[j].quantity * -1},{where: {id: array[i].id }});
                models.Document_Product_List.update({quantity: rowFE[j].quantity, deleteAt: null}
                  ,{ where: { [Op.and]: [ { DocumentId: array[i].DocumentId }, {ProductId: array[i].ProductId }  ]} });
              }
            }
          }
          if(flagDB == false){
            models.Ubication_Product_List.destroy({ where: {id: array[i].id} });
            models.Document_Product_List.destroy({ where: { [Op.and]: [ { DocumentId: array[i].DocumentId }, {ProductId: array[i].ProductId }  ]} });
          }
        }

        for(var i in rowFE){
          var flag = false;
          for( var j in array){
             if(array[j].ProductId == rowFE[i].product.id){
              flag = true;
            }
          }
          if(flag == false){
            var newRow = {};
            newRow.DocumentId = array[0].DocumentId;
            newRow.UbicationId = array[0].UbicationId;
            newRow.WarehouseId = warehouseId;
            newRow.ProductId = rowFE[i].product.id;
            newRow.quantity = rowFE[i].quantity*-1;
            newRow.user = req.body.user;
            newRow.status = 1;
            var docRow = {WarehouseId: warehouseId, DocumentId: array[0].DocumentId, 
            ProductId: rowFE[i].product.id, quantity: rowFE[i].quantity, status: true }
            models.Ubication_Product_List.create(newRow);

            models.Document_Product_List.findAll({ where: 
              { [Op.and]: [ { DocumentId: array[0].DocumentId }, {ProductId: rowFE[i].product.id }]},
              paranoid: false 
            })
            .then((row)=>{
              if( row.length > 0){
                models.Document_Product_List.update({deteledAT: null, quantity:rowFE[i].quantity},{where: {id:row[0].id},paranoid: false })
              }
              else{
                 models.Document_Product_List.create(docRow);
              }
            })
          }
        }
      });
    });

  res.status(200).send("data updated");
}


exports.delete = (req, res) => {
  let pId = req.params.id;
  models.Ubication_Product_List.destroy({where: {DocumentId: pId}});


  models.Document.destroy({where: { id: pId }})
  .then((doc) => {
    setTimeout(async(res) =>{
    const rowDelete = await models.Document_Product_List.findAll({where: {DocumentId: pId}})
      .then((av) =>{
        for(var i in av){
          var nextId = av[i].id;
          models.Document_Product_List.destroy({where: { id: nextId }});
        }
      })
    }, 1000);
    res.status(200).send('data deleted');
  });
};

exports.getSaleOrder = async (req, res) => {
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
    [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RWPWLW'}]}
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

};

exports.registerInvoice = (req, res) => {

  models.Document_Detail.update({numberInvoice: req.body.numberInvoice}, { where: {DocumentId: req.body.id} })
  .then(() =>{
      models.Ubication.findAll({  where: { [Op.and]: 
    [ {WarehouseId: req.body.WarehouseId}, {ubicationName: 'RWPWLW'}  ] } })
  .then(async(ubiOrigin) => {

    //Ubicación para Pedidos de Mayoreo
    const ubiDestinaton = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: req.body.WarehouseId}, {ubicationName: 'RXPXLX'}  ] } });

      for(var i in req.body.Products){
        for(var j in req.body.Products[i].Ubication_Product_Lists){
          //Compara entre Document y UPL por DocumentId
          if(req.body.id == req.body.Products[i].Ubication_Product_Lists[j].DocumentId){
            //Pregunta en UPL si el producto se encuentra en RWPWLW de la Bodega Origigen
            if(ubiOrigin[0].id == req.body.Products[i].Ubication_Product_Lists[j].UbicationId){
              //Si es así hace el update de UPL donde cambiara el UbicationId, WarehouseId
              models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0 },
                { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
            }
          }
        }
      }

      //Actualiza estado = 4 del Doc en el Tracking...
      models.Tracking.update({ status: 4 }, { where: {documentId:req.body.id} })
      
      //Registra el movimiento en GeneralRegister...
      var doc = {documentId: req.body.id, status:4};  
      models.General_Register.create(doc)

      res.status(200).send("data send");
    })
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })


  
}
