'use strict';
const models = require('../../models/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const PDF = require('pdfkit');
const fs = require('fs');

exports.getCustomerReport = async (req, res) => {
  
	var doc = new PDF();
	//var stream = doc.pipe(blobStream());

  //getting data.
  const defaultList = await models.Customer.findAll({
    attributes: ['name', 'firstName', 'lastName', 'phone1', 'email', 'address', 'company', 'addressCompany'],
    include: [{
      model: models.Warehouse, as: "warehouse",
    }],
      order: [['id', 'ASC']],
      where: {status: true}
    })
  .then(customers => {
    return customers;
  })
  .catch(error => {
    res.status(404).send('Internal Server Error:' + error);
  });

  //Image
  doc.image('C:/EMOTION/client/src/assets/images/logo1.png', 0, 0, {width: 200, height: 100})
  doc.moveDown();

  let pageWidth = Math.round(doc.page.width - doc.page.margins.left - doc.page.margins.right);
  let timeInMss = new Date(Date.now()).toLocaleString().slice(0,9);;

  let headerList = [{item1:'Global Emotion S.A.', item2:'Fecha: ' + timeInMss}, {item1:'San Pedro, 150 N. Fuente Hispanidad', item2:'Teléfono: 2253-5959'}];

  for(var i in headerList){
    //set columns width
    let widthHeader1 = 0.6*pageWidth;
    let widthHeader2 = 0.5*pageWidth;

    var textSpacer = 5;

    let yHeader = doc.y;
    let xHeader = doc.x;

    //header
    yHeader = doc.y;
    xHeader = doc.x;
    doc.font('Times-Italic', 12);
    doc.text(headerList[i].item1, xHeader + textSpacer, yHeader + textSpacer, { align: 'left', continued: false, width: widthHeader1}) 
    doc.text(headerList[i].item2, xHeader + widthHeader1 + 2*textSpacer, yHeader + textSpacer, { align: 'right', continued: false, width: widthHeader2})
    doc.text('', xHeader, yHeader, {continued: false,})
    doc.moveDown(1);
  }
  doc.moveDown(2);

  //tittle
  doc.font('Helvetica-Bold', 14).text('Información General de Clientes Activos', {align: 'center'});
  doc.moveDown();

  //body
  var txt1 = 'Nombre Completo';
  var txt2 = 'Teléfono';
  var txt3 = 'Email';

  //set columns width
  let width1 = 0.4*pageWidth;
  let width2 = 0.2*pageWidth;
  let width3 = 0.5*pageWidth
  var textSpacer = 5;

  let y = doc.y;
  let x = doc.x;

  //table text
  y = doc.y;
  x = doc.x;
  doc.font('Courier-BoldOblique', 12);
  doc.text(txt1, x + textSpacer, y + textSpacer, { align: 'center', continued: false, width: width1}) 
  doc.text(txt2, x + width1 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width: width2})
  doc.text(txt3, x + width1 + width2 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width:width3})
  doc.text('', x, y, {continued: false,})
  doc.moveDown(2);

  //fetch de data..
  for(var i in defaultList){
    
    //set columns width
    let width1 = 0.4*pageWidth;
    let width2 = 0.2*pageWidth;
    let width3 = 0.5*pageWidth

    var textSpacer = 5;

    let y = doc.y;
    let x = doc.x;

    //table text
    y = doc.y;
    x = doc.x;
    doc.font('Helvetica', 11);
    doc.text(defaultList[i].name + ' ' + defaultList[i].firstName + ' ' + defaultList[i].lastName, x + textSpacer, y + textSpacer, {continued: false, width: width1}) 
    doc.text(defaultList[i].phone1, x + width1 + 2*textSpacer, y + textSpacer, {continued: false, width: width2})
    doc.text(defaultList[i].email, x + width1 + width2 + 2*textSpacer, y + textSpacer, {continued: false, width:width3})

    doc.text('', x, y, {continued: false,})
    doc.moveDown(2);
  }

  const range = doc.bufferedPageRange();

  //footer.
  for( let i = range.start; i <  (range.start + range.count); i++) {
    doc.switchToPage(i);
    doc.text(`Página ${i + 1} de ${range.count}`, 
      200, 
      doc.page.height - 40, 
      { height : 25, width : 100});
  }
  
  //saving name file
  doc.pipe(fs.createWriteStream(__dirname + '_listadoClientes.pdf'));
  doc.pipe(res);
  doc.end();

  //res.send(doc);
  console.log("Imprimiendo: " + defaultList.length + " archivos..");
};

exports.getEmployeeReport = async (req, res) => {
  
  var doc = new PDF();
  //var stream = doc.pipe(blobStream());

  //getting data..
  const defaultList = await models.Employee.findAll({
    attributes: ['name', 'firstName', 'lastName', 'phone1', 'email', 'address'],
    include: [{
      model: models.Warehouse
    },{
      model: models.Department, as: 'department'
    },{
      model: models.Job_Position, as: 'jobPosition'
    }],
    order: [['id', 'ASC']],
    where: {status: true}
  })
  .then(customers => {
    return customers;
  })
  .catch(error => {
    res.status(404).send('Internal Server Error:' + error);
  });

  //Image
  doc.image('C:/EMOTION/client/src/assets/images/logo1.png', 0, 0, {width: 200, height: 100})
  doc.moveDown();

  let pageWidth = Math.round(doc.page.width - doc.page.margins.left - doc.page.margins.right);
  let timeInMss = new Date(Date.now()).toLocaleString().slice(0,9);

  let headerList = [{item1:'Global Emotion S.A.', item2:'Fecha: ' + timeInMss}, {item1:'San Pedro, 150 N. Fuente Hispanidad', item2:'Teléfono: 2253-5959'}];

  for(var i in headerList){
    //set columns width
    let widthHeader1 = 0.6*pageWidth;
    let widthHeader2 = 0.5*pageWidth;

    var textSpacer = 5;

    let yHeader = doc.y;
    let xHeader = doc.x;

    //header
    yHeader = doc.y;
    xHeader = doc.x;
    doc.font('Times-Italic', 12);
    doc.text(headerList[i].item1, xHeader + textSpacer, yHeader + textSpacer, { align: 'left', continued: false, width: widthHeader1}) 
    doc.text(headerList[i].item2, xHeader + widthHeader1 + 2*textSpacer, yHeader + textSpacer, { align: 'right', continued: false, width: widthHeader2})
    doc.text('', xHeader, yHeader, {continued: false,})
    doc.moveDown(1);
  }
  doc.moveDown(2);

  // tittle
  doc.font('Helvetica-Bold', 14).text('Información General de Empleados Activos', {align: 'center'});
  doc.moveDown();

  //body
  var txt1 = 'Nombre Completo';
  var txt2 = 'Teléfono';
  var txt3 = 'Email';

  //set columns width
  let width1 = 0.4*pageWidth;
  let width2 = 0.2*pageWidth;
  let width3 = 0.5*pageWidth;
  var textSpacer = 5;

  let y = doc.y;
  let x = doc.x;

  //table text
  y = doc.y;
  x = doc.x;
  doc.font('Courier-BoldOblique', 12);
  doc.text(txt1, x + textSpacer, y + textSpacer, { align: 'center', continued: false, width: width1}) 
  doc.text(txt2, x + width1 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width: width2})
  doc.text(txt3, x + width1 + width2 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width:width3})
  doc.text('', x, y, {continued: false,})
  doc.moveDown(2);

  //fetch the data..
  for(var i in defaultList){
    
    //set columns width
    let width1 = 0.4*pageWidth;
    let width2 = 0.2*pageWidth;
    let width3 = 0.5*pageWidth

    var textSpacer = 5;

    let y = doc.y;
    let x = doc.x;

    //table text
    y = doc.y;
    x = doc.x;
    doc.font('Helvetica', 11);
    doc.text(defaultList[i].name + ' ' + defaultList[i].firstName + ' ' + defaultList[i].lastName, x + textSpacer, y + textSpacer, {continued: false, width: width1}) 
    doc.text(defaultList[i].phone1, x + width1 + 2*textSpacer, y + textSpacer, {continued: false, width: width2})
    doc.text(defaultList[i].email, x + width1 + width2 + 2*textSpacer, y + textSpacer, {continued: false, width:width3})

    doc.text('', x, y, {continued: false,})
    doc.moveDown(2);
  }

  const range = doc.bufferedPageRange();

  //footer
  for( let i = range.start; i <  (range.start + range.count); i++) {
    doc.switchToPage(i);
    doc.text(`Página ${i + 1} de ${range.count}`, 
      200, 
      doc.page.height - 40, 
      { height : 25, width : 100});
  }
  
  //saving name file
  doc.pipe(fs.createWriteStream(__dirname + '_listadoEmpleados.pdf'));
  doc.pipe(res);
  doc.end();

  //res.send(doc);
  console.log("Imprimiendo: " + defaultList.length + " archivos..");
};

exports.getUPLReport = async (req, res) => {
  let defaultList = [];
  let user;

  if(req.body.length > 0){
    defaultList = req.body;
    user = req.body[0].user;
  }

  var doc = new PDF();
  //var stream = doc.pipe(blobStream());

  // const defaultList = await models.Ubication_Product_List.getAllByProductIds({
  //   attributes: ['WarehouseId', 'ProductId', 'quantity'],
  //   order: [['id', 'ASC']],
  //   where: { id: {[Op.in]: pIds} }
  // })
  // .then(customers => {
  //   return customers;
  // })
  // .catch(error => {
  //   res.status(404).send('Internal Server Error:' + error);
  // });

  //Image
  doc.image('C:/EMOTION/client/src/assets/images/logo1.png', 0, 0, {width: 200, height: 100})
  doc.moveDown();

  let pageWidth = Math.round(doc.page.width - doc.page.margins.left - doc.page.margins.right);
  let timeInMss = new Date(Date.now()).toLocaleString().slice(0,9);;

  let headerList = [{item1:'Global Emotion S.A.', item2:'Fecha: ' + timeInMss}, {item1:'San Pedro, 150 N. Fuente Hispanidad', item2:'Usuario: ' + user}];

  for(var i in headerList){
    //set columns width
    let widthHeader1 = 0.6*pageWidth;
    let widthHeader2 = 0.5*pageWidth;

    var textSpacer = 5;

    let yHeader = doc.y;
    let xHeader = doc.x;

    //header
    yHeader = doc.y;
    xHeader = doc.x;
    doc.font('Times-Italic', 12);
    doc.text(headerList[i].item1, xHeader + textSpacer, yHeader + textSpacer, { align: 'left', continued: false, width: widthHeader1}) 
    doc.text(headerList[i].item2, xHeader + widthHeader1 + 2*textSpacer, yHeader + textSpacer, { align: 'right', continued: false, width: widthHeader2})
    doc.text('', xHeader, yHeader, {continued: false,})
    doc.moveDown(1);
  }
  doc.moveDown(2);

  //tittle
  doc.font('Helvetica-Bold', 14).text('Productos por Cantidades (Inventario vs Planta)', {align: 'center'});
  doc.moveDown();

  //body
  var txt1 = 'Producto';
  var txt2 = 'Ubicación';
  var txt3 = 'Medida';
  var txt4 = 'Cantidad';
  var txt5 = 'En Planta';

  //set columns width
  let width1 = 0.3*pageWidth;
  let width2 = 0.2*pageWidth;
  let width3 = 0.2*pageWidth
  let width4 = 0.2*pageWidth;
  let width5 = 0.2*pageWidth;
  var textSpacer = 5;

  let y = doc.y;
  let x = doc.x;

  //table text
  y = doc.y;
  x = doc.x;
  doc.font('Courier-BoldOblique', 12);
  doc.text(txt1, x + textSpacer, y + textSpacer, { align: 'center', continued: false, width: width1}) 
  doc.text(txt2, x + width1 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width: width2})
  doc.text(txt3, x + width1 + width2 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width:width3})
  doc.text(txt4, x + width1 + width2 + width3 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width:width4})
  doc.text(txt5, x + width1 + width2 + width3 + + width4 + 2*textSpacer, y + textSpacer, { align: 'center', continued: false, width:width5})
  doc.text('', x, y, {continued: false,})
  doc.moveDown(2);

  //fetch de data..
  for(var i in defaultList){
    
    //set columns width
    let width1 = 0.3*pageWidth;
    let width2 = 0.2*pageWidth;
    let width3 = 0.2*pageWidth;
    let width4 = 0.2*pageWidth;
    let width5 = 0.2*pageWidth;

    var textSpacer = 5;

    let y = doc.y;
    let x = doc.x;

    //table text
    y = doc.y;
    x = doc.x;
    doc.font('Helvetica', 11);
    doc.text(defaultList[i].product.code, x + textSpacer, y + textSpacer, {continued: false, width: width1}) 
    doc.text(defaultList[i].ubication.name, x + width1 + 2*textSpacer, y + textSpacer, {align:'center', continued: false, width: width2})
    doc.text(defaultList[i].product.measure, x + width1 + width2 + 2*textSpacer, y + textSpacer, {align:'center', continued: false, width:width3})
    doc.text(defaultList[i].quantity, x + width1 + width2 + width3 + 2*textSpacer, y + textSpacer, {align:'center', continued: false, width:width4})
    doc.text("_______", x + width1 + width2 + width3 + width4 + 2*textSpacer, y + textSpacer, {align:'center', continued: false, width:width5})
    doc.text('', x, y, {continued: false,})
    doc.moveDown(2);
  }

  const range = doc.bufferedPageRange();

  //footer.
  for( let i = range.start; i <  (range.start + range.count); i++) {
    doc.switchToPage(i);
    doc.text(`Página ${i + 1} de ${range.count}`, 
      200, 
      doc.page.height - 40, 
      { height : 25, width : 100});
  }
  
  doc.pipe(fs.createWriteStream(__dirname + '_listadoUPL.pdf'));
  doc.pipe(res);
  doc.end();

 //  stream.on('finish', function() {
 //   iframe.src = stream.toBlobURL('application/pdf');
  // });

  //res.send(doc);
  console.log("Imprimiendo: " + defaultList.length + " archivos..");
};
