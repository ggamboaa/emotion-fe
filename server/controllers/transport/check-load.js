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
    [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RXPXLX'}]}
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

exports.update = (req, res) => {

  // if(req.body.vehicle){
  //   models.Document_Detail.update({loadVehicle: req.body.vehicle.id}, { where: {DocumentId: req.body.id} });
  // }

  models.Ubication.findAll({  where: { [Op.and]: 
    [ {WarehouseId: req.body.WarehouseId}, {ubicationName: 'RXPXLX'}  ] } })
  .then(async(ubiOrigin) => {

    //Ubicación para Pedidos de Mayoreo
    const ubiDestinaton = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: req.body.WarehouseId}, {ubicationName: 'RYPYLY'}  ] } });

    const ubiReceipt = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: req.body.WarehouseId}, {ubicationName: '1A1'}  ] } });

    for(var i in req.body.Products){

      for(var j in req.body.Products[i].Ubication_Product_Lists){

        //Compara entre Document y UPL por DocumentId
        if(req.body.id == req.body.Products[i].Ubication_Product_Lists[j].DocumentId){
          //Pregunta en UPL si el producto se encuentra en RWPWLW de la Bodega Origen
          if(ubiOrigin[0].id == req.body.Products[i].Ubication_Product_Lists[j].UbicationId){

            if(req.body.ids.length > 0){
              console.log('Recorre ids');
              //Si la bandera permanece en false significa que el producto no viene en la lista de FE
              var flag = false;
              //Recorre la lista de FE
              for(var k in req.body.ids){
                if(req.body.ids[k] == req.body.Products[i].Ubication_Product_Lists[j].ProductId){
                  console.log('Encuentra id');

                  flag = true;
                  //pregunta si las cantidades son iguales?
                  if(req.body.quantitys[k] == req.body.Products[i].Ubication_Product_Lists[j].quantity){
                    // console.log('Cantidades Iguales');

                  //Si es así hace el update de UPL donde cambiara el UbicationId, WarehouseId
                  models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0 },
                    { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });

                  }else{
                    console.log('Cantidades No son iguales?????');
                    console.log(req.body.Products[i].Ubication_Product_Lists[j].quantity + ' -  '+ req.body.quantitys[k])
                    var quantityReceipt = req.body.Products[i].Ubication_Product_Lists[j].quantity - req.body.quantitys[k];

                    //Actualiza en UPL UbicationId, WarehouseId y quantity
                    // models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0, quantity: req.body.quantitys[k] },
                    // { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });

                    //Trae los productos de la ubicación
                    const upls = await models.Ubication_Product_List.findAll({where: {UbicationId: ubiReceipt[0].id,}})
                    .then((upls) =>{
                      //Pregunta si hay productos
                      if(upls.length < 1){
                        //si no hay la crea
                        models.Ubication_Product_List.create({DocumentId: null, UbicationId: ubiReceipt[0].id, WarehouseId: req.body.WarehouseId,
                          quantity: quantityReceipt, user: req.body.user, status: 1, ProductId: req.body.ids[k]  })

                        models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0, quantity: req.body.quantitys[k] },
                            { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
                      }
                      else{
                        var xflag = false;
                        //Recorrela lista de productos de UPl
                        for(var m in upls){
                          //Pregunta si ya existe el producto en la ubicación
                          if(upls[m].ProductId == req.body.ids[k]){
                            xflag = true;
                            //Le actuailza la cantidad al producto
                            var newQuantity = upls[m].quantity + quantityReceipt;
                            models.Ubication_Product_List.update({quantity: newQuantity},{where: {id: upls[m].id}});

                            models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0, quantity: req.body.quantitys[k] },
                              { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
                          }
                        }
                        if(xflag == false){
                          //Si el prodducto no esta en la lista lo crea
                          models.Ubication_Product_List.create({DocumentId: null, UbicationId: ubiReceipt[0].id, WarehouseId: req.body.WarehouseId,
                            quantity: quantityReceipt, user: req.body.user, status: 1, ProductId: req.body.ids[k]  })

                          models.Ubication_Product_List.update({ UbicationId: ubiDestinaton[0].id, status: 0, quantity: req.body.quantitys[k] },
                            { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
                        }
                      }
                    })

                    
                  }
                }
              }
              if(flag == false){
                console.log('Producto no esta en la lista de FE');

                //Actualiza upl a la ubicación de 1A1
                // models.Ubication_Product_List.update({ UbicationId: ubiReceipt[0].id, status: 1 , DocumentId: null},
                //   { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });

                const upls = await models.Ubication_Product_List.findAll({where: {UbicationId: ubiReceipt[0].id,}})
                .then((upls) =>{
                  //Pregunta si hay productos
                  if(upls.length < 1){
                    //si no hay la actualiza
                    models.Ubication_Product_List.update({ UbicationId: ubiReceipt[0].id, status: 1 , DocumentId: null},
                      { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
                  }
                  else{
                    var xflag = false;
                    //Recorrela lista de productos de UPl
                    for(var m in upls){
                      //Pregunta si ya existe el producto en la ubicación
                      if(upls[m].ProductId == req.body.Products[i].Ubication_Product_Lists[j].ProductId){
                        xflag = true;
                        //Le actuailza la cantidad al producto
                        var newQuantity = upls[m].quantity + req.body.Products[i].Ubication_Product_Lists[j].quantity;

                        models.Ubication_Product_List.update({quantity: newQuantity},{where: {id: upls[m].id}});
                        models.Ubication_Product_List.destroy({where: {id: req.body.Products[i].Ubication_Product_Lists[j].id}})
                      }
                    }
                    if(xflag == false){
                      //Si el prodducto no esta en la lista lo crea
                      models.Ubication_Product_List.update({ UbicationId: ubiReceipt[0].id, status: 1 , DocumentId: null},
                        { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
                    }
                  }
                })

              }
            }
            else{
              console.log('No recorre ids');
              //Si lista de FE viene vacia actualiza UPL donde cambia UbicationId a la posición a 1A1
              // models.Ubication_Product_List.update({ UbicationId: ubiReceipt[0].id, status: 1, DocumentId: null },
              //   { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });

              const upls = await models.Ubication_Product_List.findAll({where: {UbicationId: ubiReceipt[0].id,}})
              .then((upls) =>{
                //Pregunta si hay productos
                if(upls.length < 1){
                  //si no hay la actualiza
                  models.Ubication_Product_List.update({ UbicationId: ubiReceipt[0].id, status: 1 , DocumentId: null},
                    { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
                }
                else{
                  var xflag = false;
                  //Recorrela lista de productos de UPl
                  for(var m in upls){
                    //Pregunta si ya existe el producto en la ubicación
                    if(upls[m].ProductId == req.body.Products[i].Ubication_Product_Lists[j].ProductId){
                      xflag = true;
                      //Le actuailza la cantidad al producto
                      var newQuantity = upls[m].quantity + req.body.Products[i].Ubication_Product_Lists[j].quantity;

                      models.Ubication_Product_List.update({quantity: newQuantity},{where: {id: upls[m].id}});
                      models.Ubication_Product_List.destroy({where: {id: req.body.Products[i].Ubication_Product_Lists[j].id}})
                    }
                  }
                  if(xflag == false){
                    //Si el prodducto no esta en la lista lo crea
                    models.Ubication_Product_List.update({ UbicationId: ubiReceipt[0].id, status: 1 , DocumentId: null},
                      { where: {id: req.body.Products[i].Ubication_Product_Lists[j].id} });
                  }
                }
              })
            }
            
           
          }
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