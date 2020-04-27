(function() {
  'use strict';

  angular
  .module('utn')
  .controller('RequisitionController', RequisitionController);

  /** @ngInject */
  function RequisitionController(rDocument, rSaleOrder, rWarehouse, $log, $window, $rootScope, SweetAlert, bsLoadingOverlayService,
   toastr, $timeout, moment, PAGINATION_CONFIG, DATE_ISO_FORMAT, authenticationService) {
    var vm = this,
    requisitionEdited;

    vm.actions = [{ id:'1', name:'Editar' }, { id:'2', name:'Cerrar' }, { id:'3', name:'Eliminar' }];
    vm.enabled = false;

    vm.query = {};
    vm.ubicationToWork = {};
    vm.selectedItem = {};

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
      vm.user = userInfo[0].user;
    }

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

    vm.searchRequisition = searchRequisition;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadRequisition = loadRequisition;
    vm.createRequisition = createRequisition;
    //vm.deleteStore = deleteStore;
    //vm.updateStatus = updateStatus;

    vm.performAction = performAction;

    function init () {
      checkWarehouses();
      //loadRequisition(vm.sort, vm.direction);
    }
    init();

    function loadRequisition(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'requisition-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = [1];
      vm.query.typeDoc = 7;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.enabled = true;
      }

      rDocument.query(vm.query, function(result){
        vm.requisitionList  = result.records;

        angular.forEach(vm.requisitionList, function(item){
          if(item.status == '1'){
            item.status = true;
          }

          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();

          if(item.WarehouseId){
            rWarehouse.query({id:item.WarehouseId}, function(resWarehouse){
              if(resWarehouse){
                item.warehouseName = resWarehouse.name;
              }
            }, function () {
              toastr.error('Error al obtener los datos de la Sucursal.');
            });
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'requisition-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'requisition-overlay'});
      });
    }

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
      loadRequisition();
    }

    function performAction(_requisition) {
      if (_requisition) {
        var action = parseInt(_requisition.action);
        switch (action) {
          case 1:
              editRequisition(_requisition);
            break;
          case 2:
            if ($rootScope.hasPermissionsFor('Administrador') || $rootScope.hasPermissionsFor('Inventario')) {
              closeRequisition(_requisition);
            } else {
              toastr.info('No tiene permisos para cerrar');
            }
            break;
          case 3:
              deleteRequisition(_requisition);
            break;
        }
      }
      $timeout(function () {
        angular.element('.actions-requisitions').selectpicker('deselectAll');
      }, 500);
    }

    function createRequisition(){
      angular.element('#modalCreateRequisition').modal({backdrop: 'static', keyboard: false});
    }

    function editRequisition(_requisition){
      vm.selectedItem = _requisition;
      angular.element('#modalEditRequisition').modal({backdrop: 'static', keyboard: false});
    }

    function closeRequisition(item){
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
              toastr.info('Requisición cerrado satisfactoriamente', {
                onShown: function () {
                  init();
                }
              });
            }, function(error){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error(error.data.message, 'Error al cerrar Requisición');
            });
          }
        });
      }else{
        toastr.error('Requisición debe contener al menos un Producto asociado', 'Error al cerrar Requisición');
      }
    }

    function deleteRequisition(item){
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
            toastr.info('Requisición eliminada satisfactoriamente', {
              onShown: function () {
                loadRequisition();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Requisición');
          });
        }
      });
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadRequisition();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadRequisition();
    }

    function range (n) {
      return new Array(n);
    }

    function searchRequisition(){
      vm.pageNum = 1;
      loadRequisition();
    }

    requisitionEdited = $rootScope.$on('requisitionEdited', function() {
      vm.query.filter = null;
      checkWarehouses();
      loadRequisition();
    });

    $rootScope.$on('$destroy', requisitionEdited);

  }
})();
