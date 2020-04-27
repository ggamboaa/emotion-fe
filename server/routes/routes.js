'user strict';

const express = require('express');
const bodyParser = require('body-parser');


//-------------------------ADMIN---------------------------
const department = require('../controllers/admin/department');
const jobPosition = require('../controllers/admin/job-position');
const warehouse = require('../controllers/admin/warehouse');
const employee = require('../controllers/admin/employee');
const user = require('../controllers/admin/user');
const rol = require('../controllers/admin/rol');


//-------------------------SALE---------------------------
const customer = require('../controllers/sale/customer');
const saleOrder = require('../controllers/sale/sale-order');


//-------------------------TRANSPORT---------------------------
const vehicle = require('../controllers/transport/vehicle');
const review = require('../controllers/transport/review');
const fuel = require('../controllers/transport/fuel');
const mileage = require('../controllers/transport/mileage');
const oil = require('../controllers/transport/oil');
const repair = require('../controllers/transport/repair');

//** Process **
const adminVehicle = require('../controllers/transport/admin-vehicle');
const checkLoad = require('../controllers/transport/check-load');
const journey = require('../controllers/transport/journey');
const reservation = require('../controllers/transport/reservation');


//-------------------------INVENTORY---------------------------
const product = require('../controllers/inventory/product');
const brand = require('../controllers/inventory/brand');
const loadIndex = require('../controllers/inventory/load-index');
const speedRating = require('../controllers/inventory/speed-rating');
const rack = require('../controllers/inventory/rack');
const position = require('../controllers/inventory/position');
const level = require('../controllers/inventory/level');

//** Process **
const document = require('../controllers/inventory/document')
const documentProduct = require('../controllers/inventory/document-product-list')
const ubicationProduct = require('../controllers/inventory/ubication-product-list');
const ubication = require('../controllers/inventory/ubication');
const typeDocument = require('../controllers/inventory/type-document')
const reorderPoint = require('../controllers/inventory/reorder-point')
const prepareOrder = require('../controllers/inventory/prepare-order');
const transfer = require('../controllers/inventory/transfer');
const store = require('../controllers/inventory/store');
const tracking = require('../controllers/inventory/tracking');
const generalRegister = require('../controllers/inventory/general-register');


//-------------------------REPORTS---------------------------
const report = require('../pdf/report/report');


module.exports = function(app) {

    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({ extended: false }));

    //-------------------------ADMIN---------------------------
    
    ///////DEPARTMENTS
    app.get('/department', department.getAll);
    app.get('/department/:id', department.findByPk);    
    app.post('/department', department.create);
    app.put('/department/:id', department.update);
    app.delete('/department/:id', department.delete);
    app.put('/department/changeStatus/:id', department.changeStatus);


    ///////JOBPOSITION
    app.get('/jobPosition', jobPosition.getAll);
    app.get('/jobPosition/:id', jobPosition.findByPk);    
    app.post('/jobPosition', jobPosition.create);
    app.put('/jobPosition/:id', jobPosition.update);
    app.delete('/jobPosition/:id', jobPosition.delete);
    app.put('/jobPosition/changeStatus/:id', jobPosition.changeStatus);


    ///////WAREHOUSE
    app.get('/warehouse', warehouse.getAll);
    app.get('/warehouse/:id', warehouse.findByPk);    
    app.post('/warehouse', warehouse.create);
    app.put('/warehouse/:id', warehouse.update);
    app.delete('/warehouse/:id', warehouse.delete);
    app.put('/warehouse/changeStatus/:id', warehouse.changeStatus);


    ///////EMPLOYEE
    app.get('/employee', employee.getAll);
    app.get('/employee/:id', employee.findByPk);
    app.post('/employee', employee.create); 
    app.put('/employee/:id', employee.update); 
    app.delete('/employee/:id', employee.delete);
    app.put('/employee/changeStatus/:id', employee.changeStatus);


    ///////USUARIO
    app.get('/user', user.getAll);
    app.get('/user/:id', user.findByPk);
    app.post('/user', user.create); 
    app.put('/user/:id', user.update);
    app.delete('/user/:id', user.delete);
    app.post('/user/login', user.login);
    app.put('/user/changeStatus/:id', user.changeStatus);


    ///////ROLES
    app.get('/rol', rol.getAll);
    app.get('/rol/:id', rol.findByPk);
    app.post('/rol', rol.create);
    app.put('/rol/:id', rol.update);
    app.delete('/rol/:id', rol.delete);
    app.put('/rol/changeStatus/:id', rol.changeStatus);


    //-------------------------SALE---------------------------

    ///////CUSTOMER
    app.get('/customer', customer.getAll);
    app.get('/customer/:id', customer.findByPk);
    app.post('/customer', customer.create);
    app.put('/customer/:id', customer.update);
    app.delete('/customer/:id', customer.delete);
    app.put('/customer/changeStatus/:id', customer.changeStatus);


    ///////SALEORDER
    app.get('/saleOrder/getProducts', saleOrder.getProducts);
    app.get('/saleOrder/getSaleOrder', saleOrder.getSaleOrder);
    app.post('/saleOrder/close', saleOrder.close);
    app.post('/saleOrder', saleOrder.create);
    app.put('/saleOrder/:id', saleOrder.update);
    app.put('/registerInvoice/:id', saleOrder.registerInvoice);
    app.delete('/saleOrder/:id', saleOrder.delete);
    

    //-------------------------TRANSPORT---------------------------

    ///////VEHICLE
    app.get('/vehicle', vehicle.getAll);
    app.get('/vehicle/:id', vehicle.findByPk);    
    app.post('/vehicle', vehicle.create);
    app.put('/vehicle/:id', vehicle.update);
    app.delete('/vehicle/:id', vehicle.delete);
    app.put('/vehicle/changeStatus/:id', vehicle.changeStatus);


    ///////REVIEW
    app.get('/review', review.getAll);
    app.get('/review/:id', review.findByPk);    
    app.post('/review', review.create);
    app.put('/review/:id', review.update);
    app.delete('/review/:id', review.delete);
    app.put('/review/changeStatus/:id', review.changeStatus);
    

    ///////FUEL
    app.get('/fuel', fuel.getAll);
    app.get('/fuel/:id', fuel.findByPk);    
    app.post('/fuel', fuel.create);
    app.put('/fuel/:id', fuel.update);
    app.delete('/fuel/:id', fuel.delete);
    app.put('/fuel/changeStatus/:id', fuel.changeStatus);
    

    ///////MILEAGE
    app.get('/mileage', mileage.getAll);
    app.get('/mileage/:id', mileage.findByPk);    
    app.post('/mileage', mileage.create);
    app.put('/mileage/:id', mileage.update);
    app.delete('/mileage/:id', mileage.delete);
    app.put('/mileage/changeStatus/:id', mileage.changeStatus);
    

    ///////OIL
    app.get('/oil', oil.getAll);
    app.get('/oil/:id', oil.findByPk);    
    app.post('/oil', oil.create);
    app.put('/oil/:id', oil.update);
    app.delete('/oil/:id', oil.delete);
    app.put('/oil/changeStatus/:id', oil.changeStatus);


    ///////REPAIR
    app.get('/repair', repair.getAll);
    app.get('/repair/:id', repair.findByPk);
    app.post('/repair', repair.create);
    app.put('/repair/:id', repair.update);
    app.delete('/repair/:id', repair.delete);    
    app.put('/repair/changeStatus/:id', repair.changeStatus);

   
    ///////ADMIN-VEHICLE
    app.get('/adminVehicle', adminVehicle.getAll);
    app.get('/adminVehicle/:id', adminVehicle.findByPk);    
    app.post('/adminVehicle', adminVehicle.create);
    app.put('/adminVehicle/:id', adminVehicle.update);
    app.delete('/adminVehicle/:id', adminVehicle.delete);
    app.put('/adminVehicle/changeStatus/:id', adminVehicle.changeStatus);


    ///////RESERVATION
    app.get('/reservation', reservation.getAll);checkLoad
    app.get('/reservation/:id', reservation.findByPk);    
    app.post('/reservation', reservation.create);
    app.put('/reservation/:id', reservation.update);
    app.delete('/reservation/:id', reservation.delete);
    app.put('/reservation/changeStatus/:id', reservation.changeStatus);


    ///////CHECK-LOAD
    app.get('/checkLoad', checkLoad.getAll);
    app.put('/checkLoad/:id', checkLoad.update);


    ///////JOURNEY
    app.get('/journey', journey.getAll);
    app.post('/journey', journey.create);
    

    //-------------------------INVENTORY---------------------------
 
    ///////PRODUCT
    app.get('/product', product.getAll);
    app.get('/product/:id', product.findByPk);    
    app.post('/product', product.create);
    app.put('/product/:id', product.update);
    app.post('/product/importProducts', product.importProducts);
    app.delete('/product/:id', product.delete);
    app.put('/product/changeStatus/:id', product.changeStatus);
    

    ///////BRAND
    app.get('/brand', brand.getAll);
    app.get('/brand/:id', brand.findByPk);    
    app.post('/brand', brand.create);
    app.put('/brand/:id', brand.update);
    app.delete('/brand/:id', brand.delete);
    app.put('/brand/changeStatus/:id', brand.changeStatus);


    ///////LOAD_INDEX
    app.get('/loadIndex', loadIndex.getAll);


    ///////SPEED_RATING
    app.get('/speedRating', speedRating.getAll);


    ///////RACK
    app.get('/rack', rack.getAll);


    ///////POSITION
    app.get('/position', position.getAll);


    ///////LEVEL
    app.get('/level', level.getAll);


    ///////TRACKING
    app.get('/tracking', tracking.getAll);


    ///////GENERAL_REGISTER
    //app.get('/generalRegister', generalRegister.getAll);


    ///////DOCUMENT
    app.get('/document', document.getAll);
    app.get('/document/:id', document.findByPk);
    app.post('/document', document.create);
    app.post('/document/close', document.close);
    app.put('/document/:id', document.update);
    app.delete('/document/:id', document.delete);    
    app.put('/document/changeStatus/:id', document.changeStatus);


    ///////DOCUMENT_PRODUCT_LIST
    app.get('/documentProduct', documentProduct.getAll);
    app.get('/documentProduct/:id', documentProduct.findByPk);
    app.post('/documentProduct', documentProduct.create);
    app.put('/documentProduct/:id', documentProduct.update);
    app.delete('/documentProduct/:id', documentProduct.delete);    
    app.put('/documentProduct/changeStatus/:id', documentProduct.changeStatus);


    ///////UBICATION_PRODUCT_LIST
    app.get('/ubicationProduct', ubicationProduct.getAllByWareOrUbicId);        
    app.post('/ubicationProduct/getAllByProductIds', ubicationProduct.getAllByProductIds);
    app.post('/ubicationProduct/findByDocOrUbicId', ubicationProduct.findByDocOrUbicId);
    app.get('/ubicationProduct/:id', ubicationProduct.findByPk);    
    app.post('/ubicationProduct/doCount', ubicationProduct.doCount);
    app.post('/ubicationProduct', ubicationProduct.create);
    app.put('/ubicationProduct/:id', ubicationProduct.update);
    app.delete('/ubicationProduct/:id', ubicationProduct.delete);    
    app.put('/ubicationProduct/changeStatus/:id', ubicationProduct.changeStatus);


    ///////UBICATION
    app.get('/ubication', ubication.getAll);
    app.get('/ubication/findByWarehouseId/:id', ubication.findByWarehouseId);
    app.get('/ubication/:id', ubication.findByPk);
    app.post('/ubication', ubication.create);
    app.delete('/ubication/:id', ubication.delete);    
    app.put('/ubication/changeStatus/:id', ubication.changeStatus);


    ///////TYPE_DOCUMENT
    app.get('/typeDocument', typeDocument.getAll);
    app.get('/typeDocument/:id', typeDocument.findByPk);


    ///////REORDER POINT
    app.get('/reorderPoint', reorderPoint.getAll);
    app.get('/reorderPoint/:id', reorderPoint.findByPk);
    app.post('/reorderPoint', reorderPoint.create);
    app.put('/reorderPoint/:id', reorderPoint.update);
    app.delete('/reorderPoint/:id', reorderPoint.delete);    
    app.put('/reorderPoint/changeStatus/:id', reorderPoint.changeStatus);


    ///////PREPARE ORDER
    app.get('/prepareOrder', prepareOrder.getAll);
    app.get('/prepareOrder/getProducts', prepareOrder.getProducts);
    app.get('/prepareOrder/getInventoryProducts/:id', prepareOrder.getInventoryProducts);
    app.post('/prepareOrder', prepareOrder.create);
    app.put('/prepareOrder/cancelPrepareOrder', prepareOrder.cancelPrepareOrder);


    ///////TRANSFER
    app.get('/transfer', transfer.getAll);
    app.get('/transfer/getProducts', transfer.getProducts);
    app.get('/transfer/getReceiptTransfer', transfer.getReceiptTransfer);
    app.post('/transfer', transfer.create);
    app.put('/transfer/sendProducts/:id', transfer.sendProducts);
    app.put('/transfer/receiptProducts/:id', transfer.receiptProducts);

    
    ///////STORE
    app.get('/store', store.getAll);
    app.get('/store/:id', store.getProducts);
    app.put('/store/:id', store.update);
    

    //-------------------------REPORTS---------------------------
    app.get('/report/getCustomerReport', report.getCustomerReport);
    app.get('/report/getEmployeeReport', report.getEmployeeReport);
    app.post('/report/getUPLReport', report.getUPLReport);

    module.exports = app;

}
