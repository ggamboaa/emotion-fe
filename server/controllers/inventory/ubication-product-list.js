'use strict';

const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAllByWareOrUbicId = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let filter, pUbicationId, pWarehouseId = null;
  
  if(req.query.filter){
    filter = req.query.filter; 
  }
  if(req.query.UbicationId){
    pUbicationId = req.query.UbicationId; 
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
  
  let offset = page * limit;

  if(filter){
    if(pUbicationId){
      models.Ubication_Product_List.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[sort, direction]],
        where: { [Op.or]: [{DocumentId: {[Op.like]:'%'+filter+'%' }}],
          [Op.and]: [{WarehouseId: pWarehouseId}, {UbicationId: pUbicationId}, {status: true}]
        }
      })
      .then(upl => {
        res.status(200).json({'records': upl.rows, 'totalRecords':upl.count, 'numberOfPageRecords': limit});
      })
      .catch(error => {
        res.status(404).send('Internal Server Error:' + error);
      });
    }

    if(!pUbicationId){
      models.Ubication_Product_List.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[sort, direction]],
        include: [{
          model: models.Ubication,
          where: {status: true}
        }],
        where: { [Op.or]: [{DocumentId: {[Op.like]:'%'+filter+'%' }}],
          [Op.and]: [{WarehouseId: pWarehouseId}, { status: true }]
        }
      })
      .then(upl => {
        res.status(200).json({'records': upl.rows, 'totalRecords':upl.count, 'numberOfPageRecords': limit});
      })
      .catch(error => {
        res.status(404).send('Internal Server Error:' + error);
      });
    }

  }else{
    if(pUbicationId){
      models.Ubication_Product_List.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[sort, direction]],
        where: { [Op.and]: [{WarehouseId: pWarehouseId}, {UbicationId: pUbicationId}, { status: true }]
        }
      })
      .then(upl => {
        let pages = Math.ceil(upl.count / limit);  
        res.status(200).json({'records': upl.rows, 'totalRecords':upl.count, 'totalPages': pages,
          'numberOfPageRecords': limit});
      })
      .catch(error => {
        res.status(404).send('Internal Server Error:' + error);
      });
    }

    if(!pUbicationId){
      models.Ubication_Product_List.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[sort, direction]],
        include: [{
          model: models.Ubication,
          where: {status: true}
        }],
        where: { [Op.and]: [{WarehouseId: pWarehouseId}, {status: true}]
        }
      })
      .then(upl => {
        let pages = Math.ceil(upl.count / limit);  
        res.status(200).json({'records': upl.rows, 'totalRecords':upl.count, 'totalPages': pages,
          'numberOfPageRecords': limit});
      })
      .catch(error => {
        res.status(404).send('Internal Server Error:' + error);
      });
    }
  }
}; 

exports.getAllByProductIds = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let pIds = null;

  if(req.body.length > 0){
    pIds = req.body;
  }
  
  //let offset = page * limit;

  models.Ubication_Product_List.findAndCountAll({
    //limit: limit,
    //offset: offset,
    order: [[sort, direction]],
    where: { id: {[Op.in]: pIds} }
  })
  .then(upl => {
    res.status(200).json({'records': upl.rows, 'totalRecords':upl.count});
  })
  .catch(error => {
    res.status(404).send('Internal Server Error:' + error);
  });
}; 

exports.findByDocOrUbicId = (req, res) => {
  let pId = req.body.id;
  let docOrUb = req.body.docOrUb;
 
  if(docOrUb){
    models.Ubication_Product_List.findAll({
      include: [{
        model: models.Product
      }],
      where: [{DocumentId: pId}] 
      })
    .then((upl) => {
      res.json(upl);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
  }else{
    models.Ubication_Product_List.findAll({
      // include: [{
      //   model: models.Ubication
      // }],
      where: { UbicationId: pId } 
      })
    .then((upl) => {
      res.json(upl);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
  }
}

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Ubication_Product_List.findByPk(id, {})
  .then(upl => {
    res.json(upl);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.doCount = (req, res) => {
  let productList = [];

  if(req.body.length > 0){
    productList = req.body;
    
    for(var i in productList) {
      models.Ubication_Product_List.update({ quantity: productList[i].quantity }, { where: {DocumentId:productList[i].DocumentId, UbicationId:productList[i].UbicationId, WarehouseId:productList[i].WarehouseId, ProductId:productList[i].ProductId} } )
      
      .then(() => {
        if(productList[i].quantity == 0){
          models.Ubication_Product_List.destroy({ where: {DocumentId:productList[i].DocumentId, UbicationId:productList[i].UbicationId, WarehouseId:productList[i].WarehouseId, ProductId:productList[i].ProductId} })
        }
      })
      
      .catch(error => {
        console.log(error);
        res.status(404).send(error);
      })
    }
    res.status(200).send("data updated");
  }
}

exports.create = async (req, res) => {
  let pDocumentId = req.body.DocumentId;
  let pWarehouseId = req.body.WarehouseId;
  let pUbicationId = req.body.UbicationId;
  let pOldUbicationId = req.body.ubication.id;
  let pProductId = req.body.ProductId;
  let newQuantity = req.body.quantity;
  let oldQuantity = req.body.oldQuantity;
  let showMe = req.body.showMe;
  let foundQuantity = [];

  const dpList = await models.Ubication_Product_List.findAll({
    attributes: ['quantity'],
    where: { UbicationId:pUbicationId, WarehouseId:pWarehouseId, ProductId:pProductId }
    })
  .then((dpl) => {
    return dpl;
  })

  for(var i in dpList) {
    foundQuantity.push(dpList[i].quantity);
  }

  //Si NO encuentra R. Crea uno nuevo.
  if(foundQuantity.length == 0){
    models.Ubication_Product_List.create(req.body)
    .then(() => { //Actualiza (resta) Q del R almacenado. Si Q = 0 se elimina R (método al final).
      models.Ubication_Product_List.update({ quantity: oldQuantity }, { where: {DocumentId:pDocumentId, WarehouseId:pWarehouseId, UbicationId:pOldUbicationId, ProductId:pProductId} })
      .catch(error => {
        console.log(error);
        res.status(404).send(error);
      })
      res.status(200).send("new data inserted and old row updated")
    })
    .then(() => { 
      //Si se almacenó o re-ubicó toda la Q del P: se elimina de UPL
      if(oldQuantity == 0){
        models.Ubication_Product_List.destroy({ where: {DocumentId:pDocumentId, WarehouseId:pWarehouseId, UbicationId:pOldUbicationId, ProductId:pProductId} })
        .then(()=> {
          //showMe = Almacenamiento, !showMe = Re-ubicación
          if(showMe){
            //Verificar si aún existe P por almacenar (estado = 0)
            models.Ubication_Product_List.findAll({
              attributes: ['id'],
              where: { DocumentId:pDocumentId, UbicationId:pOldUbicationId, WarehouseId:pWarehouseId }
              })
            .then((dpl) => {
              console.log("length " + dpl.length);
              if(dpl.length == 0){
                console.log("AÚN TIENES " + dpl.length + " DATOS");
                models.Document.update( { status: 2 }, { where: {id: pDocumentId} }) //Almacenado.
              }
            })
          }
        })
        .catch(error => {
          console.log(error);
          res.status(404).send(error);
        })
      }
    })
  }else{ //Actualiza (resta) Q del R almacenado o reubicado. Si Q = 0 se elimina R (método al final).
    models.Ubication_Product_List.update({ quantity: oldQuantity }, { where: {DocumentId:pDocumentId, WarehouseId:pWarehouseId, UbicationId:pOldUbicationId, ProductId:pProductId} })
    .then(() => { //Actualiza (suma) Q del R duplicado. 
      models.Ubication_Product_List.update({ quantity: parseInt(foundQuantity) + newQuantity, DocumentId: pDocumentId }, { where: {UbicationId:pUbicationId, WarehouseId:pWarehouseId, ProductId:pProductId, status:true} })
      .catch(error => {
        console.log(error);
        res.status(404).send(error);
      })
      res.status(200).send("old and duplicate row updated")
    })
    .then(() => {   
      //Si se almacenó o re-ubicó toda la Q del P: se elimina de UPL
      if(oldQuantity == 0){
        models.Ubication_Product_List.destroy({ where: {DocumentId:pDocumentId, WarehouseId:pWarehouseId, UbicationId:pOldUbicationId, ProductId:pProductId} })
        .then(()=> {
          //showMe = Almacenamiento, !showMe = Re-ubicación
          if(showMe){
            //Verificar si aún existe P por almacenar (estado = 0)
            models.Ubication_Product_List.findAll({
              attributes: ['id'],
              where: { DocumentId:pDocumentId, UbicationId:pOldUbicationId, WarehouseId:pWarehouseId }
              })
            .then((dpl) => {
              console.log("length " + dpl.length);
              if(dpl.length == 0){
                console.log("AÚN TIENES " + dpl.length + " DATOS");
                models.Document.update( { status: 2 }, { where: {id: pDocumentId} }) //Almacenado.
              }
            })
          }
        })
        .catch(error => {
          console.log(error);
          res.status(404).send(error);
        })
      }
    })
  }
}

exports.update = (req, res) => {
  let pDocumentId = req.body.DocumentId;
  let pUbicationId = req.body.UbicationId;
  let pProductId = req.body.ProductId;

  models.Ubication_Product_List.update({ status: req.body.status, quantity: req.body.quantity },{ where: {DocumentId:pDocumentId, UbicationId:pUbicationId, ProductId:pProductId} } )
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
  
  models.Ubication_Product_List.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Ubication_Product_List.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
