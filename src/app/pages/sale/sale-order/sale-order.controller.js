(function() {
  'use strict';

  angular
  .module('utn')
  .controller('SaleOrderController', SaleOrderController);

  /** @ngInject */
  function SaleOrderController(rSaleOrder, rDocument, rUbicationProduct, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, $timeout,
    PAGINATION_CONFIG, authenticationService, $window, rCustomer, moment, DATE_ISO_FORMAT) {
    var vm = this,

    saleOrderEdited;
    vm.enabled = false;

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
      vm.user = userInfo[0].user;
      // vm.warehouse = vm.userConected.warehouseSelected;
    }

    vm.actions = [{ id:'1', name:'Editar' }, { id:'2', name:'Cerrar' }, { id:'3', name:'Eliminar' }];
    vm.query = {};
    vm.ubicationToWork = {};

    // sort vars
    vm.direction = 'DESC';
    vm.sort = 'id';

    //pagination vars:
    vm.rangeSelected = PAGINATION_CONFIG.allowedRanges[0];
    vm.pageNum = 1;
    vm.prevPage = 0;
    vm.nextPage = 0;
    vm.totalPages = 0;
    vm.totalRecords = 0;
    vm.numberOfPageRecords = 0;
    vm.allowedRanges = PAGINATION_CONFIG.allowedRanges;
    vm.maxPaginationItems = PAGINATION_CONFIG.maxPaginationItems;

    vm.searchSaleOrder = searchSaleOrder;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadSaleOrder = loadSaleOrder;
    vm.createSaleOrder = createSaleOrder;

    vm.performAction = performAction;

    function init () {
      checkWarehouses();
      // loadSaleOrder(vm.sort, vm.direction);
    }
    init();

    function checkWarehouses() {
      if (authenticationService.getUserInfo().warehouseList.length > 1 && !authenticationService.getUserInfo()[0].warehouseSelected) {
        $timeout(function() {
          angular.element('#modalSelectWarehouse').modal({backdrop: 'static', keyboard: false});
        }, 500);
      } else if(authenticationService.getUserInfo().warehouseList.length === 1 && !authenticationService.getUserInfo()[0].warehouseSelected) {
        authenticationService.getUserInfo()[0].warehouseSelected = userInfo.warehouseList[0];
        $window.localStorage['userInfo'] = angular.toJson(authenticationService.getUserInfo());
      } else if (authenticationService.getUserInfo().warehouseList.length === 0 && !authenticationService.getUserInfo()[0].warehouseSelected){
        toastr.error('El usuario no tiene Sucursales asociadas. Verifíque !');
      }
      loadSaleOrder();
    }

    function loadSaleOrder(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'saleOrder-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = 1;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.enabled = true;
      }

      vm.query.typeDoc = 5;

      rDocument.query(vm.query, function(result){
        vm.saleOrderList  = result.records;

        angular.forEach(vm.saleOrderList, function(item){

          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();

          if(item.Document_Detail != null){
            rCustomer.query({id: item.Document_Detail.CustomerId}, function(res){
              item.customer = res;
            });
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'saleOrder-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'saleOrder-overlay'});
      });

      //loadUbicationProductList();
    }

    function performAction(SaleOrder) {
      if (SaleOrder) {
        var action = parseInt(SaleOrder.action);
        switch (action) {
          case 1:
              editSaleOrder(SaleOrder);
            break;
          case 2:
            if ($rootScope.hasPermissionsFor('Administrador') || $rootScope.hasPermissionsFor('Inventario')) {
              closeSaleOrder(SaleOrder);
            } else {
              toastr.info('No tiene permisos para cerrar');
            }
            break;
          case 3:
              deleteSaleOrder(SaleOrder);
            break;
        }
      }
      $timeout(function () {
        angular.element('.actions-saleOrders').selectpicker('deselectAll');
      }, 500);
    }

    function createSaleOrder(){
      angular.element('#modalCreateSaleOrder').modal({backdrop: 'static', keyboard: false});
    }

    function editSaleOrder(SaleOrder){
      vm.selectedSaleOrder = SaleOrder;
      angular.element('#modalEditSaleOrder').modal({backdrop: 'static', keyboard: false});
    }

    function closeSaleOrder(item){
      if(item.Products.length > 0){
        SweetAlert.swal({
          title:'',
          text: '¿Desea cerrar el registro seleccionado?',
          showCancelButton: true,
          confirmButtonText:'Sí',
          cancelButtonText:'No',
          closeOnConfirm: true,
          closeOnCancel: true,
          allowEscapeKey: false
        },
        function(isConfirm){
          if (isConfirm) {
            vm.ubicationToWork.id = item.id;
            vm.ubicationToWork.status = 0;
            vm.ubicationToWork.typeDocumentId = item.TypeDocumentId;

            vm.ubicationToWork.rowInsert = [];
            angular.forEach(item.Products, function(pItem){
              vm.ubicationToWork.WarehouseId = pItem.Document_Product_List.WarehouseId;
              var row = {};
              row.DocumentId = pItem.Document_Product_List.DocumentId;
              row.WarehouseId = pItem.Document_Product_List.WarehouseId;
              row.UbicationId = 0;
              row.ProductId = pItem.Document_Product_List.ProductId;
              row.quantity = pItem.Document_Product_List.quantity * -1;
              row.status = 1;
              vm.ubicationToWork.rowInsert.push(row);
            })

            rSaleOrder.close(vm.ubicationToWork, function () {
              toastr.info('Orden de venta cerrado satisfactoriamente', {
                onShown: function () {
                  init();
                }
              });
            }, function(error){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error(error.data.message, 'Error al cerrar Order de Venta');
            });
          }
        });
      }else{
        toastr.error('Orden de venta debe contener al menos un Producto asociado', 'Error al cerrar Order de Venta');
      }
    }

    function deleteSaleOrder(item){
      SweetAlert.swal({
        title:'',
        text: '¿Desea eliminar el registro seleccionado?',
        showCancelButton: true,
        confirmButtonText:'Sí',
        cancelButtonText:'No',
        closeOnConfirm: true,
        closeOnCancel: true,
        allowEscapeKey: false
      },
      function(isConfirm){
        if (isConfirm) {
          rSaleOrder.delete({id:item.id}, function () {
            toastr.info('Orden de Venta eliminada satisfactoriamente', {
              onShown: function () {
                loadSaleOrder();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Orden de Venta');
          });
        }
      });
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadSaleOrder();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadSaleOrder();
    }

    function range (n) {
      return new Array(n);
    }

    function searchSaleOrder(){
      vm.pageNum = 1;
      loadSaleOrder();
    }

    saleOrderEdited = $rootScope.$on('saleOrderEdited', function() {
      vm.query.filter = null;
      loadSaleOrder();
    });

    $rootScope.$on('$destroy', saleOrderEdited);

  }
})();
