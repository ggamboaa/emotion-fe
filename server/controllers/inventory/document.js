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
  let pWarehouseId = 0;
  let status = 1;
  let typeDoc = [6];
  
  if(req.query.filter){
    filter = req.query.filter; 
  }
  if(req.query.WarehouseId){
    pWarehouseId = req.query.WarehouseId; 
  }
  if(req.query.status){
    status = req.query.status; 
  }
  if(req.query.typeDoc == 1){
    typeDoc = [4,6,9];
  }
  if(req.query.typeDoc == 4){
    typeDoc = [4];
  }
  if(req.query.typeDoc == 7){
    typeDoc = [7];
  }
  if(req.query.typeDoc == 9){
    typeDoc = [9];
  }
  if(req.query.typeDoc == 5){
    typeDoc = [5];
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
    models.Document.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{  
        model: models.Product,
          include: [{
          model: models.Ubication_Product_List,
          include: [{
            model: models.Ubication
          }]  
        }] 
      },{model: models.Type_Document},{model: models.Document_Detail}], 
      where: { [Op.or]: [{code: {[Op.like]:'%'+filter+'%'}}, {user: {[Op.like]:'%'+filter+'%'}}, {comment: {[Op.like]:'%'+filter+'%' }}],
              status: {[Op.in]: [status]}, TypeDocumentId: {[Op.in]: typeDoc}, [Op.and]: [{WarehouseId: pWarehouseId}] }
    })
    .then(documents => {
      res.status(200).json({'records': documents.rows, 'totalRecords':documents.count, 'numberOfPageRecords': limit});
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
          include: [{
            model: models.Ubication
          }]  
        }] 
      },{model: models.Type_Document},{model: models.Document_Detail}],
      where: { status: {[Op.in]: [status]}, TypeDocumentId: {[Op.in]: typeDoc}, [Op.and]: [{WarehouseId: pWarehouseId}] }
    })
    .then(documents => {
      let pages = Math.ceil(documents.count / limit);  
      res.status(200).json({'records': documents.rows, 'totalRecords':documents.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
};

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Document.findByPk(id, {
    include: [{  
      model: models.Product,
        include: [{
        model: models.Ubication_Product_List,
        include: [{
          model: models.Ubication  
        }]  
      }] 
    }] 
  })
  .then(document => {
    res.json(document);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = async (req, res) => {
  let ids = req.body.ids;
  let quantitys = req.body.quantitys;
  let warehouseId = req.body.WarehouseId;

  const nextDocCode = await models.General_Configuration.findAll({
    attributes: ['nextDocCode'],
    where: { id: 1 }
  })
  .then((genConf) => {
    return genConf;
  })

  req.body.code = nextDocCode[0].nextDocCode;

  models.Document.create(req.body)
  .then((doc) => {
    for(var i in ids){
      doc.setProducts(ids[i], { through: { quantity: quantitys[i], status: true, WarehouseId: warehouseId } });      
    }

    models.General_Configuration.update({ nextDocCode: parseInt(req.body.code) + 1 }, { where: {id: 1} });

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
  //let oldIds = req.body.oldIds;

  const doc = await models.Document.findByPk(pId);
  
  doc.update(req.body)
  .then((doc)=> {
    //doc.removeProducts(oldIds)
    //.then(()=> {
      for (var i in ids) {
        doc.addProducts(ids[i], { through: { quantity: quantitys[i], status: true, WarehouseId: warehouseId } });
      }
    //})
    res.status(200).send("data D-P updated");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.close = async (req, res) =>{
  let pId = req.body.id;
  let pStatus = req.body.status; 
  let rowInsert = req.body.rowInsert;
  let warehouseId = req.body.WarehouseId;

  const Ubication = await models.Ubication.findAll({ 
    where: {[Op.and]: [ {WarehouseId: warehouseId}, {ubicationName: 'RRPRLR'} ]}
  })
  .then((ubi) =>{
    for(var i in rowInsert){
      rowInsert[i].UbicationId = ubi[0].id;
    }
    if(rowInsert.length > 0){
      for(var j in rowInsert){
        models.Ubication_Product_List.create(rowInsert[j]);
      }
    }
  })
  .then(() =>{
    //Cambiar el estado del Doc. a cerrado (0).
    models.Document.update( { status: pStatus }, { where: {id: pId} })
    
    res.status(200).send(" data closed ");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
};

exports.delete = (req, res) => {
  let pId = req.params.id;
  
  models.Document.destroy({where: { id: pId }})
  .then((doc) => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Document.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
