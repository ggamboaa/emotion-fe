'use strict';

const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// const nodeMailer = require('nodemailer');

// exports.importProducts = (req, res) => {
//   let transporter = nodeMailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'sistema.emotioncr@gmail.com',
//         pass: 'Llantas1234'
//     }
//   });
//   let mailOptions = {
//       from: '"Carlos Tony" <sistema.emotioncr@gmail.com>', // sender address
//       to: 'carlostony94@outlook.com, tony.cr50@gmail.com',//req.body.to, // list of receivers
//       subject: 'Pruebas desde SIAT',//req.body.subject, // Subject line
//       text: ':D',//req.body.body, // plain text body
//       html: '<b>NodeJS Email Tutorial</b>' // html body
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return console.log(error);
//       }
//       console.log('Message %s sent: %s', info.messageId, info.response);
//           res.render('index');
//       });
// }

///new code
const readXlsxFile = require('read-excel-file/node');
const mysql = require('mysql');
///

exports.importProducts = (req, res) => {
// console.log('---------------En metodo!!!!!')
///NEW CODE
// File path.
// readXlsxFile('customer.xlsx').then((rows) => {
readXlsxFile('C:/Users/Emotion/Desktop/product.xlsx').then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
  
  // console.log(rows);
  
  /**
    [ [ 'Id', 'Name', 'Address', 'Age' ],
      [ 1, 'Jack Smith', 'Massachusetts', 23 ],
      [ 2, 'Adam Johnson', 'New York', 27 ],
      [ 3, 'Katherin Carter', 'Washington DC', 26 ],
      [ 4, 'Jack London', 'Nevada', 33 ],
      [ 5, 'Jason Bourne', 'California', 36 ] ] 
  */
  
  // Remove Header ROW
  rows.shift();

  // Create a connection to the database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'emotion'
  });

  // Open the MySQL connection
  connection.connect((error) => {
    if (error) {
      console.error(error);
    } else {
      // let query = 'INSERT INTO product (id, typeProduct, name, description, color, code, series, size, width, basin, basin2, diameter, measure, offset, centerHole, finish, status, brandId, speedRatingId, loadIndexId)'+
      //  'VALUES ? on duplicate key update typeProduct=values(typeProduct)';
      let query = 'insert into `emotion`.`product` (`typeProduct`,`name`,`description`,`color`,`code`,`barCode`,`series`,`size`,`width`,`basin`,`basin2`,'+
                  '`diameter`,`measure`,`offset`,`centerHole`,`finish`,`status`,`createdAt`,`updatedAt`,`brandId`,`speedRatingId`,`loadIndexId`)'+
                  'values ? on duplicate key update '+
                  'typeProduct = values(`typeProduct`),name = values(`name`),description = values(`description`),color = values(`color`),code = values(`code`),'+
                  'barCode = values(`barCode`),series = values(`series`),size = values(`size`),width = values(`width`),basin = values(`basin`),basin2 = values(`basin2`),'+
                  'diameter = values(`diameter`),measure = values(`measure`),offset = values(`offset`),centerHole = values(`centerHole`),finish = values(`finish`),'+
                  'status = values(`status`),updatedAt = values(`updatedAt`),brandId = values(`brandId`),speedRatingId = values(`speedRatingId`),loadIndexId = values(`loadIndexId`)';
      connection.query(query, [rows], (error, response) => {
        console.log(error || response);
        
        /**
          OkPacket {
            fieldCount: 0,
            affectedRows: 5,
            insertId: 0,
            serverStatus: 2,
            warningCount: 0,
            message: '&Records: 5  Duplicates: 0  Warnings: 0',
            protocol41: true,
            changedRows: 0 }        
        */
         res.status(200).send("data imported");;
      });
    }
  });
})
/////
}

exports.getAll = (req, res) => {
  let limit = 5;
  let page = 0;
  let direction = 'ASC';
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
    models.Product.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: models.Brand, as: 'brand'
      },{
        model: models.Speed_Rating, as: 'speedRating'
      },{
        model: models.Load_Index, as: 'loadIndex'
      }],
      order: [[sort, direction]],
      where: { [Op.or]: 
        [{code: {[Op.like]:'%'+filter+'%'}}, {name: {[Op.like]:'%'+filter+'%'}}, {description: {[Op.like]:'%'+filter+'%'}}, {typeProduct: {[Op.like]:'%'+filter+'%' }}, {brandId: {[Op.like]:'%'+filter+'%' }}, 
        {measure: {[Op.like]:'%'+filter+'%' }}] 
      }
    })
    .then(products => {
      res.status(200).json({'records': products.rows, 'totalRecords':products.count, 'numberOfPageRecords': limit});
    })
    .catch(error => {
      res.status(404).send('Internal Server Error:' + error);
    });
  }else{
    models.Product.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [{
        model: models.Brand, as: 'brand'
      },{
        model: models.Speed_Rating, as: 'speedRating'
      },{
        model: models.Load_Index, as: 'loadIndex'
      }],
      order: [[sort, direction]]
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

exports.findByPk = (req, res) => {
  let id = req.params.id;
 
  models.Product.findByPk(id, {
    include: [{
      model: models.Brand, as: 'brand'
    },{
      model: models.Speed_Rating, as: 'speedRating'
    },{
      model: models.Load_Index, as: 'loadIndex'
    }]
  })
  .then(product => {
    res.json(product);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
}

exports.create = (req, res) => {
  models.Product.create(req.body)
    .then((product) => {
      res.send(product);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
}

exports.update = (req, res) => {
  let pId = req.params.id;

  models.Product.update(req.body,{ where: {id: pId} } 
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
  
  models.Product.destroy({where: { id: pId }}).then(() => {
    res.status(200).send('data deleted');
  });
};

exports.changeStatus = (req, res) => {
  let id = req.params.id;

  models.Product.update( { status: req.body.status }, { where: {id: id} })
  .then(() => {
    res.status(200).send("status updated");
   });
};
