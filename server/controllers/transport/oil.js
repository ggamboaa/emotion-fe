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
    models.Oil.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Vehicle
      }],
      where: { [Op.or]: 
        [{date: {[Op.like]:'%'+filter+'%'}}, {VehicleId: {[Op.like]:'%'+filter+'%' }}] 
      }
    })
    .then(oils => {
      res.status(200).json({'records': oils.rows, 'totalRecords':oils.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Oil.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Vehicle
      }]
    })
    .then(oils => {
      let pages = Math.ceil(oils.count / limit);  
      res.status(200).json({'records': oils.rows, 'totalRecords':oils.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.findByPk = async (req, res) => {
  let id = req.params.id;
 
  const myOil = await models.Oil.findByPk(id, {
    include: [{
      model: models.Vehicle
    }]
  })
  .then(oil => {
    var idAdminVehicle = [];
    var mileageMax = 0;
    var myOil = oil.toJSON(); // actually returns a plain object, not a JSON string
    
    setTimeout(async(res) =>{
      const adminVehicle = await models.Admin_Vehicle.findAll({where: { VehicleId: 17} })
        .then((av) =>{
          for (var i in av) {
            idAdminVehicle.push(av[i].id);
          }
          setTimeout(async(res) =>{
              for(var j in idAdminVehicle){
              const myMileage = await models.Mileage.findAll({where: {AdminVehicleId: idAdminVehicle[j]}})
              .then((mileage)=>{
                for(var f in mileage){
                  
                  if(mileage[f].endMileage > mileageMax){
                    mileageMax = mileage[f].endMileage;
                    myOil.mileageOld = mileageMax;
                  }
                }
              })
            }
          })
        })

    // models.Review.create(pReview);
    // for (var j in pMileage) {
    //   models.Mileage.create(pMileage[j]);
    // }
    // for (var j in pFuel) {
    //   models.Fuel.create(pFuel[j]);
    // } 
    }, 2000);

    res.json(myOil);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.Oil.create(req.body)
    .then((oil) => {
      res.send(oil);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Oil.update(req.body,{ where: {id: pId} } 
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
  
  models.Oil.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Oil.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
