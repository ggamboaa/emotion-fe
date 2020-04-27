(function() {
  'use strict';

  angular
  .module('utn')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    //---------------------LOGIN----------------------
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/pages/authentication/login/login.html',
      controller: 'LoginController',
      controllerAs: 'login',
      data: {
        isPublic: true
      }
    })
    .state('forgotPassword', {
      url: '/forgot-pasword',
      templateUrl: 'app/pages/authentication/forgot-password/forgot-password.html',
      controller: 'ForgotPasswordController',
      controllerAs: 'forgotPassword',
      data: {
        isPublic: true
      }
    })
    .state('resetPassword', {
      url: '/reset-password/:resetToken',
      templateUrl: 'app/pages/authentication/reset-password/reset-password.html',
      controller: 'ResetPasswordController',
      controllerAs: 'resetPassword',
      data: {
        isPublic: true
      }
    })
    .state('home', {
      url: '/',
      templateUrl: 'app/pages/home/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    })

    //---------------------ADMIN----------------------

    //Mantenimientos
    .state('admin', {
      url: '/admin',
      templateUrl: 'app/pages/admin/parent/admin-parent.html',
      controller: 'AdminController',
      controllerAs: 'adminParent',
      params: {
        childList: [
          {
            routerState: 'admin.department',
            requiredPermissions: ['Administrador']
          },
          {
            routerState: 'admin.jobPosition',
            requiredPermissions: ['Administrador']
          },
          {
            routerState: 'admin.warehouse',
            requiredPermissions: ['Administrador']
          },
          {
            routerState: 'admin.employee',
            requiredPermissions: ['Administrador']
          },
          {
            routerState: 'admin.user',
            requiredPermissions: ['Administrador']
          },
          {
            routerState: 'admin.rol',
            requiredPermissions: ['Administrador']
          }
        ]
      }
    })
    .state('admin.department', {
      url: '/departamentos',
      templateUrl: 'app/pages/admin/department/department.html',
      controller: 'DepartmentController',
      controllerAs: 'department'
    })
    .state('admin.jobPosition', {
      url: '/puestos',
      templateUrl: 'app/pages/admin/job-position/job-position.html',
      controller: 'JobPositionController',
      controllerAs: 'jobPosition'
    })
    .state('admin.warehouse', {
      url: '/sucursales',
      templateUrl: 'app/pages/admin/warehouse/warehouse.html',
      controller: 'WarehouseController',
      controllerAs: 'warehouse'
    })
    .state('admin.employee', {
      url: '/empleados',
      templateUrl: 'app/pages/admin/employee/employee.html',
      controller: 'EmployeeController',
      controllerAs: 'employee'
    })
    .state('admin.user', {
      url: '/usuarios',
      templateUrl: 'app/pages/admin/user/user.html',
      controller: 'UserController',
      controllerAs: 'user'
    })
    .state('admin.rol', {
      url: '/roles',
      templateUrl: 'app/pages/admin/rol/rol.html',
      controller: 'RolController',
      controllerAs: 'rol'
    })

   //Procesos
    .state('adminProcess', {
      url: '/procesos-admin',
      templateUrl: 'app/pages/admin/parent/admin-parent.html',
      controller: 'AdminController',
      controllerAs: 'adminParent',
      params: {
        childList: [
          {
            routerState: 'adminProcess.changeWarehouse',
            requiredPermissions: ['Administrador','Ventas','Inventario','Transporte']
          }
        ]
      }
    })
    .state('adminProcess.changeWarehouse', {
      url: '/cambiar-sucursal',
      templateUrl: 'app/pages/admin/change-warehouse/change-warehouse.html',
      controller: 'ChangeWarehouseController',
      controllerAs: 'changeWarehouse'
    })


    //---------------------SALE----------------------

    //Mantenimientos
    .state('sale', {
      url: '/ventas',
      templateUrl: 'app/pages/sale/parent/sale-parent.html',
      controller: 'SaleController',
      controllerAs: 'saleParent',
      params: {
        childList: [
          {
            routerState: 'sale.customer',
            requiredPermissions: ['Administrador', 'Ventas']
          }
        ]
      }
    })
    .state('sale.customer', {
      url: '/clientes',
      templateUrl: 'app/pages/sale/customer/customer.html',
      controller: 'CustomerController',
      controllerAs: 'customer'
    })

    //Procesos
    .state('saleProcess', {
      url: '/procesos-ventas',
      templateUrl: 'app/pages/sale/parent/sale-parent.html',
      controller: 'SaleController',
      controllerAs: 'saleParent',
      params: {
        childList: [
          {
            routerState: 'saleProcess.saleOrder',
            requiredPermissions: ['Administrador', 'Ventas']
          },
          {
            routerState: 'saleProcess.registerInvoice',
            requiredPermissions: ['Administrador', 'Ventas']
          }
        ]
      }
    })
    .state('saleProcess.saleOrder', {
      url: '/orden-compra',
      templateUrl: 'app/pages/sale/sale-order/sale-order.html',
      controller: 'SaleOrderController',
      controllerAs: 'saleOrder'
    })
    .state('saleProcess.registerInvoice', {
      url: '/registrar-factura',
      templateUrl: 'app/pages/sale/register-invoice/register-invoice.html',
      controller: 'RegisterInvoiceController',
      controllerAs: 'registerInvoice'
    })


    //---------------------TRANSPORT----------------------

    //Mantenimientos
    .state('transport', {
      url: '/transportes',
      templateUrl: 'app/pages/transport/parent/transport-parent.html',
      controller: 'TransportController',
      controllerAs: 'transportParent',
      params: {
        childList: [
          {
            routerState: 'transport.oil',
            requiredPermissions: ['Administrador', 'Transporte']
          },
          {
            routerState: 'transport.vehicle',
            requiredPermissions: ['Administrador', 'Transporte']
          },
          {
            routerState: 'transport.repair',
            requiredPermissions: ['Administrador', 'Transporte']
          }
        ]
      }
    })
    .state('transport.oil', {
      url: '/aceites',
      templateUrl: 'app/pages/transport/oil/oil.html',
      controller: 'OilController',
      controllerAs: 'oil'
    })
    .state('transport.vehicle', {
      url: '/vehiculos',
      templateUrl: 'app/pages/transport/vehicle/vehicle.html',
      controller: 'VehicleController',
      controllerAs: 'vehicle'
    })
    .state('transport.repair', {
      url: '/reparaciones',
      templateUrl: 'app/pages/transport/repair/repair.html',
      controller: 'RepairController',
      controllerAs: 'repair'
    })

    //Procesos
    .state('transportProcess', {
      url: '/procesos-transportes',
      templateUrl: 'app/pages/transport/parent/transport-parent.html',
      controller: 'TransportController',
      controllerAs: 'transportParent',
      params: {
        childList: [
          {
            routerState: 'transportProcess.checkLoad',
            requiredPermissions: ['Administrador', 'Transporte']
          },
          {
            routerState: 'transportProcess.adminVehicle',
            requiredPermissions: ['Administrador', 'Transporte']
          },
          {
            routerState: 'transportProcess.journey',
            requiredPermissions: ['Administrador', 'Transporte']
          },
          {
            routerState: 'transportProcess.reservation',
            requiredPermissions: ['Administrador', 'Transporte']
          }
        ]
      }
    })
    .state('transportProcess.checkLoad', {
      url: '/chequeo-carga',
      templateUrl: 'app/pages/transport/check-load/check-load.html',
      controller: 'CheckLoadController',
      controllerAs: 'checkLoad'
    })
    .state('transportProcess.adminVehicle', {
      url: '/admin-vehiculo',
      templateUrl: 'app/pages/transport/admin-vehicle/admin-vehicle.html',
      controller: 'AdminVehicleController',
      controllerAs: 'adminVehicle'
    })
    .state('transportProcess.journey', {
      url: '/ruta',
      templateUrl: 'app/pages/transport/journey/journey.html',
      controller: 'JourneyController',
      controllerAs: 'journey'
    })
    .state('transportProcess.reservation', {
      url: '/reservaciones',
      templateUrl: 'app/pages/transport/reservation/reservation.html',
      controller: 'ReservationController',
      controllerAs: 'reservation'
    })

    //---------------------INVENTORY----------------------

    //Mantenimientos
    .state('inventory', {
      url: '/inventarios',
      templateUrl: 'app/pages/inventory/parent/inventory-parent.html',
      controller: 'InventoryController',
      controllerAs: 'inventoryParent',
      params: {
        childList: [
          {
            routerState: 'inventory.brand',
            requiredPermissions: ['Administrador','Inventario']
          },
          {
            routerState: 'inventory.product',
            requiredPermissions: ['Administrador','Inventario']
          }
        ]
      }
    })
    .state('inventory.product', {
      url: '/produtos',
      templateUrl: 'app/pages/inventory/product/product.html',
      controller: 'ProductController',
      controllerAs: 'product'
    })
    .state('inventory.brand', {
      url: '/marcas',
      templateUrl: 'app/pages/inventory/brand/brand.html',
      controller: 'BrandController',
      controllerAs: 'brand'
    })

    //Procesos
    .state('inventoryProcess', {
      url: '/procesos-inventarios',
      templateUrl: 'app/pages/inventory/parent/inventory-parent.html',
      controller: 'InventoryController',
      controllerAs: 'inventoryParent',
      params: {
        childList: [
          {
            routerState: 'inventoryProcess.document',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.return',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.store',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.reorderPoint',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.reubication',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.count',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.requisition',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.prepareOrder',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.transfer',
            requiredPermissions: ['Administrador', 'Inventario']
          },
          {
            routerState: 'inventoryProcess.tracking',
            requiredPermissions: ['Administrador', 'Inventario']
          }
        ]
      }
    })
    .state('inventoryProcess.document', {
      url: '/recibos',
      templateUrl: 'app/pages/inventory/document/document.html',
      controller: 'DocumentController',
      controllerAs: 'document'
    })
    .state('inventoryProcess.return', {
      url: '/devoluciones',
      templateUrl: 'app/pages/inventory/return/return.html',
      controller: 'ReturnController',
      controllerAs: 'return'
    })
    .state('inventoryProcess.store', {
      url: '/almacenamientos',
      templateUrl: 'app/pages/inventory/store/store.html',
      controller: 'StoreController',
      controllerAs: 'store'
    })
    .state('inventoryProcess.reorderPoint', {
      url: '/puntos-reorden',
      templateUrl: 'app/pages/inventory/reorder-point/reorder-point.html',
      controller: 'ReorderPointController',
      controllerAs: 'reorderPoint'
    })
    .state('inventoryProcess.reubication', {
      url: '/reubicaciones',
      templateUrl: 'app/pages/inventory/reubication/reubication.html',
      controller: 'ReubicationController',
      controllerAs: 'reubication'
    })
    .state('inventoryProcess.count', {
      url: '/conteo',
      templateUrl: 'app/pages/inventory/count/count.html',
      controller: 'CountController',
      controllerAs: 'count'
    })
    .state('inventoryProcess.requisition', {
      url: '/requisiciones',
      templateUrl: 'app/pages/inventory/requisition/requisition.html',
      controller: 'RequisitionController',
      controllerAs: 'requisition'
    })
    .state('inventoryProcess.prepareOrder', {
      url: '/alistos',
      templateUrl: 'app/pages/inventory/prepare-order/prepare-order.html',
      controller: 'PrepareOrderController',
      controllerAs: 'prepareOrder'
    })
    .state('inventoryProcess.transfer', {
      url: '/traslados',
      templateUrl: 'app/pages/inventory/transfer/transfer.html',
      controller: 'TransferController',
      controllerAs: 'transfer'
    })
    .state('inventoryProcess.tracking', {
      url: '/seguimiento-pedidos',
      templateUrl: 'app/pages/inventory/tracking/tracking.html',
      controller: 'TrackingController',
      controllerAs: 'tracking'
    })

    //---------------------INFORMATION----------------------

    //Mantenimientos
    .state('information', {
      url: '/información',
      templateUrl: 'app/pages/information/parent/information-parent.html',
      controller: 'InformationController',
      controllerAs: 'informationParent',
      params: {
        childList: [
          {
            routerState: 'information.aboutUs',
            requiredPermissions: ['Administrador','Inventario', 'Ventas', 'Transporte', 'Consultas']
          }
        ]
      }
    })
    .state('information.aboutUs', {
      url: '/acerca-de',
      templateUrl: 'app/pages/information/about-us/about-us.html',
      controller: 'AboutUsController',
      controllerAs: 'aboutUs'
    })
  }
})();
