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
  let status = 1;
  
  if(req.query.filter){
    filter = req.query.filter; 
  }
  if(req.query.status){
    status = req.query.status; 
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
    models.Admin_Vehicle.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Review
      }],
      where: { [Op.or]: 
        [{id: {[Op.like]:'%'+filter+'%'}}],
        [Op.and]: [{status: status}] 
      }
    })
    .then(Admin_Vehicles => {
      res.status(200).json({'records': Admin_Vehicles.rows, 'totalRecords':Admin_Vehicles.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Admin_Vehicle.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [[sort, direction]],
      include: [{
        model: models.Vehicle, as: "vehicle"
      }],
      where: {status: status}
    })
    .then(Admin_Vehicles => {
      let pages = Math.ceil(Admin_Vehicles.count / limit);  
      res.status(200).json({'records': Admin_Vehicles.rows, 'totalRecords':Admin_Vehicles.count, 'totalPages': pages,
        'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }
}; 

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Admin_Vehicle.findByPk(id,{
    include: [
      {
      model: models.Vehicle, as: 'vehicle'
      }
      ,
      {
        model: models.Review
      }
      ,
      {
        model: models.Mileage
      },
      {
        model: models.Fuel
      }
    ],
    order: [[{model: models.Mileage},'initDate','ASC'],[{model: models.Fuel},'date','ASC']]
  })
  .then(Admin_Vehicle => {
    res.json(Admin_Vehicle);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  let pReview = req.body.reviewDetail;
  let pMileage = req.body.mileageDetailList;
  let pFuel = req.body.fuelDetailList;

  models.Admin_Vehicle.create(req.body)
    .then((adminV) => {

      setTimeout(async(res) =>{
        const adminVehi = await models.Admin_Vehicle.findByPk(adminV.id)
          .then((av) =>{
            pReview.AdminVehicleId = av.id;
            // console.log(pMileage);
            for (var i in pMileage) {
              pMileage[i].AdminVehicleId = av.id;
            }
            for (var i in pFuel) {
              pFuel[i].AdminVehicleId = av.id;
            }
            
          })
          models.Review.create(pReview);
          for (var j in pMileage) {
            models.Mileage.create(pMileage[j]);
          }
          for (var j in pFuel) {
            models.Fuel.create(pFuel[j]);
          }
          
        }, 1000);
        
        res.status(200).send("data inserted");
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}


exports.update = (req, res) => {
  let pId = req.params.id;
  let pReview = req.body.reviewDetail;
  let pMileage = req.body.mileageDetailList;
  let pFuel = req.body.fuelDetailList;

  models.Admin_Vehicle.update(req.body,{ where: {id: pId} } 
    ).then(()=> {

      setTimeout(async(res) =>{
        const adminVehi = await models.Admin_Vehicle.findByPk(pId)
          .then((av) =>{
            if(req.body.reviewUpdate){
              let reviewId = req.body.Review.id;
              models.Review.update(pReview,{ where: {id: reviewId}});
              // console.log('+++++++++++ '+ reviewId + ' +++++++++++')
            }

            if(req.body.mileageUpdate){
              for (var i in pMileage) {
                models.Mileage.update(pMileage[i],{ where: {id: pMileage[i].id}});
                // console.log('+++++++++++ '+ pMileage[i].id + ' +++++++++++')
              }
            }

            if(req.body.fuelUpdate){
              for (var i in pFuel) {
                models.Fuel.update(pFuel[i],{ where: {id: pFuel[i].id}});
                // console.log('+++++++++++ '+ pFuel[i].id + ' +++++++++++')
              }
            }

          //   pReview.AdminVehicleId = av.id;
          //   // console.log(pMileage);
          //   for (var i in pMileage) {
          //     pMileage[i].AdminVehicleId = av.id;
          //   }
          //   for (var i in pFuel) {
          //     pFuel[i].AdminVehicleId = av.id;
          //   }
            
          })
          // models.Review.create(pReview);
          // for (var j in pMileage) {
          //   models.Mileage.create(pMileage[j]);
          // }
          // for (var j in pFuel) {
          //   models.Fuel.create(pFuel[j]);
          // }
          
        }, 1000);

    res.status(200).send("data updated");
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}


// exports.update = (req, res) => {
//   let pId = req.params.id;

//   models.Admin_Vehicle.update(req.body,{ where: {id: pId} } 
//     ).then(()=> {
//     res.status(200).send("data updated");
//   })
//   .catch(error => {
//     console.log(error);
//     res.status(404).send(error);
//   })
// }

exports.delete = (req, res) => {
  let pId = req.params.id;
  
  models.Admin_Vehicle.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Admin_Vehicle.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
