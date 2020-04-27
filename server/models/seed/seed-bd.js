'use strict'

const models = require('../db');

//ADMIN
const _GENERAL_CONFIGURATION = require('./admin/general-configuration.json');
const _DEPARTMENTS = require('./admin/departments.json');
const _EMPLOYEES = require('./admin/employees.json');
const _JOB_POSITIONS = require('./admin/job-positions.json');
const _ROLS = require('./admin/rols.json');
const _USERS = require('./admin/users.json');
const _WAREHOUSES = require('./admin/warehouses.json');

//SALE
const _CUSTOMERS = require('./sale/customers.json');

//INVENTORY
const _PRODUCTS = require('./inventory/products.json');
const _BRANDS = require('./inventory/brands.json');
const _LOAD_INDEXES = require('./inventory/load-indexes.json');
const _SPEED_RATINGS = require('./inventory/speed-ratings.json');
const _RACKS = require('./inventory/racks.json');
const _POSITIONS = require('./inventory/positions.json');
const _LEVELS = require('./inventory/levels.json');
const _UBICATIONS = require('./inventory/ubications.json');
const _REORDER_POINTS = require('./inventory/reorder-points.json')
const _TYPE_DOCUMENTS = require('./inventory/type-documents.json')

//TRANSPORT
const _VEHICLES = require('./transport/vehicles.json');
const _RESERVATIONS = require('./transport/reservations.json');
const _OILS = require('./transport/oils.json');
const _REPAIR = require('./transport/repairs.json');
const _REPAIR_DETAIL = require('./transport/repairs-details.json');

function insertingMaintenanceData() {
	// models.General_Configuration.bulkCreate(_GENERAL_CONFIGURATION)
	models.Department.bulkCreate(_DEPARTMENTS)
	models.Job_Position.bulkCreate(_JOB_POSITIONS)
	// models.Warehouse.bulkCreate(_WAREHOUSES)
	models.Employee.bulkCreate(_EMPLOYEES)
	models.Rol.bulkCreate(_ROLS)
	// models.User.bulkCreate(_USERS) 
	// .then(() => {
	// 	models.User.create({
	// 		user: 'admin',
	// 		email: 'admin@admin.com',
	// 		password: '1234',
	// 		status: true,
	// 		employeeId: 1
	// 	})
		// .then((users) => {
		// 	users.setRols([1]);
		// })
	// })
// 	.then(() => {
// 		models.Customer.bulkCreate(_CUSTOMERS)
// 		.catch(error => {
// 			console.log('ERROR SALES DATA ADDING' + '<br/>' + error);
// 		})	
// 	})
// 	.then(() => {
// 		models.Brand.bulkCreate(_BRANDS)
// 		models.Load_Index.bulkCreate(_LOAD_INDEXES)
// 		models.Speed_Rating.bulkCreate(_SPEED_RATINGS)
// 		models.Product.bulkCreate(_PRODUCTS)
// 		models.Rack.bulkCreate(_RACKS)
// 		models.Position.bulkCreate(_POSITIONS)
// 		models.Level.bulkCreate(_LEVELS)
// 		models.Ubication.bulkCreate(_UBICATIONS)
// 		models.Type_Document.bulkCreate(_TYPE_DOCUMENTS)
// 		.catch(error => {
// 			console.log('ERROR INVENTORY DATA ADDING' + '<br/>' + error);
// 		})	
// 	})
// 	.then(() => {
// 		models.Vehicle.bulkCreate(_VEHICLES)
// 		models.Reservation.bulkCreate(_RESERVATIONS)
// 		models.Oil.bulkCreate(_OILS)
// 		models.Repair.bulkCreate(_REPAIR)
// 		models.Repair_Detail.bulkCreate(_REPAIR_DETAIL)
// 		.catch(error => {
// 			console.log('ERROR TRANSPORT DATA ADDING' + '<br/>' + error);
// 		})	
// 	})
// 	.catch(error => {
// 		console.log('ERROR ADMIN DATA ADDING' + '<br/>' + error);
// 	})					
}

module.exports = {
	insertingMaintenanceData
} 