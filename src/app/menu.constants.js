(function () {
  'use strict';

  angular
  .module('utn')
  .constant('SIDEBAR_MENU', [{
    text: 'Inicio',
    title: 'Inicio',
    routerState: 'home',
    icon: 'fa-home'
  }])

  .constant('HEADER_MENU', [{
    text: 'Administrativo',
    title: 'Administrativo',
    wider: true,
    hasDropDownMenu: true,
    dropDownItems: [
      {
        text: 'Mantenimientos',
        title: 'Mantenimientos',
        routerState: 'admin',
        icon: '',
        small: true,
        requiredPermissions: ['Administrador'],
        subNavItems: [{
            text: 'Departamentos',
            routerState: 'admin.department',
            title: 'Departamentos',
            requiredPermissions: ['Administrador'],
            icon: 'fa-sitemap'
          },{
            text: 'Puestos',
            routerState: 'admin.jobPosition',
            title: 'Puestos',
            requiredPermissions: ['Administrador'],
            icon: 'fa-laptop'
          },{
            text: 'Sucursales',
            routerState: 'admin.warehouse',
            title: 'Sucursales',
            requiredPermissions: ['Administrador'],
            icon: 'fa-building'
          },{
            text: 'Empleados',
            routerState: 'admin.employee',
            title: 'Empleados',
            requiredPermissions: ['Administrador'],
            icon: 'fa-briefcase'
          },{
            text: 'Usuarios',
            routerState: 'admin.user',
            title: 'Usuarios',
            requiredPermissions: ['Administrador'],
            icon: 'fa-user'
          },{
            text: 'Roles',
            routerState: 'admin.rol',
            title: 'Roles',
            requiredPermissions: ['Administrador'],
            icon: 'fa-tags'
          }]
      },
      {
        text: 'Procesos',
        title: 'Procesos',
        routerState: 'adminProcess',
        icon: '',
        small: true,
        requiredPermissions: ['Administrador', 'Ventas', 'Inventario', 'Transporte'],
        subNavItems: [{
          text: 'Cambiar Sucursal',
          routerState: 'adminProcess.changeWarehouse',
          title: 'Cambiar Sucursal',
          requiredPermissions: ['Administrador', 'Ventas', 'Inventario', 'Transporte'],
          icon: 'fa-industry'
        }]
      }]
  },{
    text: 'Ventas',
    title: 'Ventas',
    routerState: 'sale',
    wider: true,
    hasDropDownMenu: true,
    dropDownItems: [
      {
        text: 'Mantenimientos',
        title: 'Mantenimientos',
        routerState: 'sale',
        icon: 'fa-book',
        small: true,
        requiredPermissions: ['Administrador', 'Ventas'],
        subNavItems: [
          {
            text: 'Clientes',
            routerState: 'sale.customer',
            title: 'Clientes',
            requiredPermissions: ['Administrador', 'Ventas'],
            icon: 'fa-users'
          }]
      },
      {
        text: 'Procesos',
        title: 'Procesos',
        routerState: 'saleProcess',
        icon: 'fa-user',
        requiredPermissions: ['Administrador','Ventas'],
        subNavItems: [
        {
          text: 'Orden de Salida',
          routerState: 'saleProcess.saleOrder',
          title: 'Orden de Salida',
          requiredPermissions: ['Administrador', 'Ventas'],
          icon: 'fa-money'
        },
        {
          text: 'Registrar Factura',
          routerState: 'saleProcess.registerInvoice',
          title: 'Registrar Factura',
          requiredPermissions: ['Administrador', 'Ventas'],
          icon: 'fa-file-text-o'
        }]
      }]
  },{
    text: 'Transporte',
    title: 'Transporte',
    routerState: 'transport',
    wider: true,
    hasDropDownMenu: true,
    dropDownItems: [
      {
        text: 'Mantenimientos',
        title: 'Mantenimientos',
        routerState: 'transport',
        icon: 'fa-book',
        small: true,
        requiredPermissions: ['Administrador', 'Transporte'],
        subNavItems: [{
          text: 'Cambio de Aceite',
          routerState: 'transport.oil',
          title: 'Cambio de Aceite',
          requiredPermissions: ['Administrador', 'Transporte'],
          icon: 'fa-tint'
        },{
          text: 'Vehículos',
          routerState: 'transport.vehicle',
          title: 'Vehículos',
          requiredPermissions: ['Administrador', 'Transporte'],
          icon: 'fa-truck'
        },{
          text: 'Registrar Reparación',
          routerState: 'transport.repair',
          title: 'Registrar Reparación',
          requiredPermissions: ['Administrador', 'Transporte'],
          icon: 'fa-gears'
        }]
      },
      {
        text: 'Procesos',
        title: 'Procesos',
        routerState: 'transportProcess',
        icon: '',
        small: true,
        requiredPermissions: ['Administrador', 'Transporte'],
        subNavItems: [{
          text: 'Chequeo y Carga',
          routerState: 'transportProcess.checkLoad',
          title: 'Chequeo y Carga',
          requiredPermissions: ['Administrador', 'Transporte'],
          icon: 'fa-pencil-square-o'
        },{
          text: 'Gestionar Vehículos',
          routerState: 'transportProcess.adminVehicle',
          title: 'Gestionar Vehículos',
          requiredPermissions: ['Administrador', 'Transporte'],
          icon: 'fa-dashboard'
        },{
          text: 'Establecer Ruta',
          routerState: 'transportProcess.journey',
          title: 'Establecer Ruta',
          requiredPermissions: ['Administrador', 'Transporte'],
          icon: 'fa-road'
        },{
          text: 'Reservaciones',
          routerState: 'transportProcess.reservation',
          title: 'Reservaciones',
          requiredPermissions: ['Administrador', 'Transporte'],
          icon: 'fa-tasks'
        }]
      }]
  },{
    text: 'Inventario',
    title: 'Inventario',
    routerState: 'inventory',
    wider: true,
    hasDropDownMenu: true,
    dropDownItems: [
      {
        text: 'Mantenimientos',
        title: 'Mantenimientos',
        routerState: 'inventory',
        icon: 'fa-book',
        small: true,
        requiredPermissions: ['Administrador', 'Inventario'],
        subNavItems: [{
            text: 'Marcas',
            routerState: 'inventory.brand',
            title: 'Marcas',
            requiredPermissions: ['Administrador', 'Inventario'],
            icon: 'fa-yoast'
          },{
            text: 'Productos',
            routerState: 'inventory.product',
            title: 'Productos',
            requiredPermissions: ['Administrador', 'Inventario'],
            icon: 'fa-cubes'
          }]
      },
      {
        text: 'Procesos',
        title: 'Procesos',
        routerState: 'inventoryProcess',
        icon: 'fa-book',
        small: true,
        requiredPermissions: ['Administrador', 'Inventario'],
        subNavItems: [{
          text: 'Recibos',
          routerState: 'inventoryProcess.document',
          title: 'Recibos',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-cube'
        },{
          text: 'Devoluciones',
          routerState: 'inventoryProcess.return',
          title: 'Devoluciones',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-refresh'
        },{
          text: 'Almacenamientos',
          routerState: 'inventoryProcess.store',
          title: 'Almacenamientos',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-archive'
        },{
          text: 'Puntos de Reorden',
          routerState: 'inventoryProcess.reorderPoint',
          title: 'Puntos de Reorden',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-paperclip'
        },{
          text: 'Reubicaciones',
          routerState: 'inventoryProcess.reubication',
          title: 'Reubicaciones',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-retweet'
        },{
          text: 'Conteo',
          routerState: 'inventoryProcess.count',
          title: 'Conteo',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-calculator'
        },{
          text: 'Requisiciones',
          routerState: 'inventoryProcess.requisition',
          title: 'Requisiciones',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-eraser'
        },{
          text: 'Alistos',
          routerState: 'inventoryProcess.prepareOrder',
          title: 'Alistos',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-cart-arrow-down'
        },{
          text: 'Traslados',
          routerState: 'inventoryProcess.transfer',
          title: 'Traslados',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-random'
        },{
          text: 'Seguimiento Pedidos',
          routerState: 'inventoryProcess.tracking',
          title: 'Seguimiento Pedidos',
          requiredPermissions: ['Administrador', 'Inventario'],
          icon: 'fa-ravelry'
        }]
      }]
  },{
    text: 'Información',
    title: 'Información',
    routerState: 'information',
    wider: true,
    hasDropDownMenu: true,
    dropDownItems: [
      {
        text: 'General',
        title: 'General',
        routerState: 'information',
        icon: 'fa-book',
        small: true,
        requiredPermissions: ['Administrador', 'Inventario', 'Ventas', 'Transporte', 'Consultas'],
        subNavItems: [{
            text: 'Acerca de...',
            routerState: 'information.aboutUs',
            title: 'Acerca de...',
            requiredPermissions: ['Administrador', 'Inventario', 'Ventas', 'Transporte', 'Consultas'],
            icon: 'fa-info-circle'
          }]
      }]
  }])

.constant('FOOTER_MENU', [{
  text: 'Ayuda',
  title: 'Ayuda',
  routerState: 'ayuda'
}, {
  text: 'Políticas',
  title: 'Políticas',
  routerState: 'politicas'
}, {
  text: 'Terminos y Condiciones',
  title: 'Terminos y Condiciones',
  routerState: 'terminos'
}])

;

})();
