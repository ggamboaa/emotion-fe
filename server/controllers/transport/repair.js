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
    models.Repair.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: models.Vehicle
      },
      {
        model: models.Repair_Detail
      }],
      order: [[sort, direction]],
      where: {
        [Op.or]: 
          [{user: {[Op.like]:'%'+filter+'%' }},{date: {[Op.like]:'%'+filter+'%' }}]
      }
    })
    .then(Repairs => {
      res.status(200).json({'records': Repairs.rows, 'totalRecords':Repairs.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Repair.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: models.Vehicle
      },
      {
        model: models.Repair_Detail
      }],
      order: [[sort, direction]]
    })
    .then(Repairs => {
      let pages = Math.ceil(Repairs.count / limit);  
      res.status(200).json({'records': Repairs.rows, 'totalRecords':Repairs.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Repair.findByPk(id, {
    include: [{
      model: models.Vehicle
    },
    {
      model: models.Repair_Detail
    }]
  })
  .then(repair => {
    res.json(repair);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

// beforeBulkCreate(instances, options)
// beforeBulkUpdate(options)
// beforeBulkDestroy(options)
// afterBulkCreate(instances, options)
// afterBulkUpdate(options)
// afterBulkDestroy(options)

exports.create = (req, res) => {
  let ids = req.body.ids;
  var rowSave = req.body.rowSave

  models.Repair.create(req.body)
  .then((repair) =>{
    for( var i in rowSave){
      rowSave[i].RepairId = repair.id;
      models.Repair_Detail.create(rowSave[i]);
    }
    res.status(200).send("data inserted");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

// exports.update = (req, res) => {
//   let pId = req.params.id;

//   models.Repair.update(req.body,{ where: {id: pId} } 
//     ).then(()=> {
//     res.status(200).send("data updated");
//   })
//   .catch(error => {
//     console.log(error);
//     res.status(404).send(error);
//   })
// }

exports.update = (req, res) => {
  var rowFE = req.body.repairsDetail;
  var rowDB = req.body.Repair_Details;

  for(const i in rowFE){
    // var flag = false;
    for(const j in rowDB){
      if(rowDB[j].id == rowFE[i].id){
        // flag = true;
        console.log(rowFE[i].repair.id)
        if(rowDB[j].amount != rowFE[i].amount || rowDB[j].detail != rowFE[i].observations || rowDB[j].typeRepair != rowFE[i].repair.id){
          var updateRow = {};
          // updateRow.id = rowFE[i].id;
          updateRow.typeRepair = rowFE[i].repair.id;
          updateRow.detail = rowFE[i].observations;
          updateRow.amount = rowFE[i].amount;
          updateRow.status = 1;
          models.Repair_Detail.update(updateRow,{ where: {id: rowFE[i].id} });
        }
      }
    }
    // if(!flag){
    //   var newRow = {};
    //   newRow.typeRepair = rowFE[i].repair.id;
    //   newRow.detail = rowFE[i].observations;
    //   newRow.amount = rowFE[i].amount;
    //   newRow.status = 1;
    //   newRow.RepairId = req.body.id;
    //   models.Repair_Detail.create(newRow);
    // }
  }

  for(const i in rowFE){
    var flag = false;
    for(const j in rowDB){
      if(rowDB[j].id == rowFE[i].id){
        flag = true;
      }
    }
    if(!flag){
      var newRow = {};
      newRow.typeRepair = rowFE[i].repair.id;
      newRow.detail = rowFE[i].observations;
      newRow.amount = rowFE[i].amount;
      newRow.status = 1;
      newRow.RepairId = req.body.id;
      models.Repair_Detail.create(newRow);
    }
  }

  for(const j in rowDB){
    var flag = false;
    for(const i in rowFE){
      if(rowDB[j].id == rowFE[i].id){
        flag = true;
      }
    }
    if(!flag){
      models.Repair_Detail.destroy({where: { id: rowDB[j].id }});
    }
  }



  res.status(200).send("data updated");

}

// exports.update = async (req, res) => {
//   let pId = req.params.id;
//   let rowUpdate = req.body.rowUpdate;
//   let rowSave = req.body.rowSave;
//   let rowDelete = req.body.rowDelete;

//   setTimeout(async(res) =>{
//   const doc = await models.Repair.findByPk(pId)
//     .then((av) =>{
//       if(rowUpdate.length > 0){
//         console.log('Esta acutalizando');
//         for(var i in rowUpdate){
//           models.Repair_Detail.update(rowUpdate[i],{ where: {id: rowUpdate[i].id} });
//         }
//       }

//       if(rowSave.length > 0){
//         console.log('Esta Guardando');
//         for(var j in rowSave){
//           models.Repair_Detail.create(rowSave[j]);
//         }
//       }

//       if(rowDelete.length > 0){
//         console.log('Esta Eliminando');
//         for(var k in rowDelete){
//           models.Repair_Detail.destroy( {where: { id: rowDelete[k].id }});
//         }
//       }
//     })
    
//   }, 1000);
//   res.status(200).send("data updated");
// }



exports.delete = (req, res) => {
  let pId = req.params.id;
  
  models.Repair.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Repair.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
