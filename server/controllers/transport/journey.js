'use strict';

const models = require('../../models/db');
const mySequelize = require('sequelize');
const Op = mySequelize.Op;
const nodeMailer = require('nodemailer');

exports.getAll = async (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'DESC';
  let sort = 'id';
  let pWarehouseId = null;
  let filter = null;

  var store = {};
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
  
  let offset = page * limit;

  if(filter){
    // console.log('ESta filtrando???');
    const upl = await models.Ubication_Product_List.findAll({
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
      [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RYPYLY'}]}
    }
    ]
    })
    .then((av) =>{
      console.log(av);
      if(av.length > 0){
        for(var i in av){
          idDocs.push(av[i].DocumentId);
        } 
      }
      
      models.Document.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[sort, direction]],
        include: [ 
        { model: models.Type_Document, as: 'Type_Document'},
        { model: models.Document_Detail,
          where: {numberInvoice: {[Op.like]:'%'+filter+'%'}}}
          ],
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

  }else{

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
      [Op.and]: [{WarehouseId: pWarehouseId} , {ubicationName: 'RYPYLY'}]}
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
  }
};


exports.create = (req, res) => {
  var documentsId = [];
  var warhouseId = 0;
  var email = "     Se creó una nueva ruta con la(s) siguiente(s) Factura(s): "


  //Crea el Journey
  models.Journey.create(req.body)
  .then(async(journey) =>{
    //Actualiza en JourneyId de los Documentos y se guardan los DocumentId en docuemntsIds
    for(var i in req.body.invoiceDetailList){
      documentsId.push(req.body.invoiceDetailList[i].documentId);
      email += req.body.invoiceDetailList[i].numberInvoice + ", ";
      models.Document_Detail.update({JourneyId: journey.id}, {where: {id: req.body.invoiceDetailList[i].documentDetailId}})
      
      //Actualiza estado = 5 del Doc en el Tracking...
      models.Tracking.update({ status: 5 }, { where: {documentId:req.body.invoiceDetailList[i].documentId} })
    
      //Registra el movimiento en GeneralRegister...
      var doc = {documentId:req.body.invoiceDetailList[i].documentId, status:5};  
      models.General_Register.create(doc)

    }
    email += "con fecha de entraga para el día: "+ req.body.date;
    //Se busca el Id del a ubicación donde esta almacenada la meracadería que se va enviar.
    const ubiOrigin = await models.Ubication.findAll({ where: { [Op.and]: 
      [ {WarehouseId: req.body.warehouseId}, {ubicationName: 'RYPYLY'}  ] } });
    console.log(ubiOrigin[0].id);

    //Busca todos los UPl de los Documentos
    models.Ubication_Product_List.findAll({ where: { [Op.and]: 
      [ {UbicationId: ubiOrigin[0].id}, {DocumentId: {[Op.in]: documentsId}}  ] }})
    .then((upls) =>{
      console.log(upls.length);
      for(var i in upls){
        //Elimna todos los upls
        models.Ubication_Product_List.destroy({where: {id: upls[i].id}});
      }
    })
    //send Email
    let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'sistema.emotioncr@gmail.com',
          pass: 'Llantas1234'
      }
    });
    let mailOptions = {
        from: '"SAIT" <sistema.emotioncr@gmail.com>', // sender address
        to: 'carlostony94@outlook.com, tony.cr50@gmail.com, gilbert.g.alvarado@gmail.com',//req.body.to, // list of receivers
        subject: 'Seguimiento de Pedidos',//req.body.subject, // Subject line
        text: email,//req.body.body, // plain text body
        html: '<b>Nueva Ruta de Entrega</b><br>'+ email // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
            res.render('index');
        });

    res.status(200).send("data create");
  })
  .catch(error => {
    res.status(404).send('Internal Server Error:' + error);
  });
}
