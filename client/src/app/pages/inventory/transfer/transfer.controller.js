(function() {
  'use strict';

  angular
  .module('utn')
  .controller('TransferController', TransferController);

  /** @ngInject */
  function TransferController(rDocument, rEmployee, rWarehouse, rSaleOrder, rPrepareOrder, rUbicationProduct, $log, $rootScope, SweetAlert, bsLoadingOverlayService,
   moment, toastr, PAGINATION_CONFIG, authenticationService, rTransfer, $timeout, $window, DATE_ISO_FORMAT) {
    var vm = this,
    transferEdited;

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
      vm.user = userInfo[0].user;
    }

    vm.typeTransferList = [{id:1, name:'Traslados'},{id:2, name:'Crear Traslado'},{id:3, name:'Recibir Traslado'},{id:4, name:'Enviar Traslado'}];
    vm.actions = [{ id:'1', name:'Editar' }, { id:'2', name:'Cerrar' }, { id:'3', name:'Eliminar' }];

    vm.query = {};
    vm.newTransfer = {};
    vm.ubicationToWork = {};
    vm.processTransfer = 0;
    vm.enabled = false;

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

    vm.searchTransfer = searchTransfer;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadSendTransfer = loadSendTransfer;
    vm.loadReceiptTransfer = loadReceiptTransfer;
    vm.sendTransfer = sendTransfer;
    vm.receiptTransfer = receiptTransfer;
    vm.checkWarehouses = checkWarehouses;

    vm.loadTransfer = loadTransfer;
    vm.performAction = performAction;
    vm.performTableAction = performTableAction;

    function init () {
      vm.typeTransfer = vm.typeTransferList[0];
      // loadTransfer(vm.sort, vm.direction);
      checkWarehouses();
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
      loadTransfer();
    }

    function performTableAction(Table) {
      if (Table) {
        var action = parseInt(Table.action);
        switch (action) {
          case 1:
              editTransfer(Table);
            break;
          case 2:
            if ($rootScope.hasPermissionsFor('Administrador') || $rootScope.hasPermissionsFor('Inventario')) {
              closeTransfer(Table);
            } else {
              toastr.info('No tiene permisos para cerrar');
            }
            break;
          case 3:
              deleteTransfer(Table);
            break;
        }
      }
      $timeout(function () {
        angular.element('.actions-tables').selectpicker('deselectAll');
      }, 500);
    }

    function performAction(type) {
        switch (type) {
          case 1:
              vm.processTransfer = 0;
              vm.query.filter = null;
              loadTransfer();
            break;
          case 2:
              createTransfer();
              vm.query.filter = null;
              vm.processTransfer = 0;
              vm.typeTransfer = vm.typeTransferList[0];
            break;
          case 3:
              vm.processTransfer = 1;
              vm.query.filter = null;
              loadReceiptTransfer();
            break;
          case 4:
              vm.processTransfer = 2;
              vm.query.filter = null;
              loadSendTransfer();
            break;
        }
      // $timeout(function () {
      //   angular.element('.actions-transfers').selectpicker('deselectAll');
      // }, 500);
    }

    function createTransfer(){
      angular.element('#modalCreateTransfer').modal({backdrop: 'static', keyboard: false});
    }

    function loadReceiptTransfer(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'transfer-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = 0;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.warehouse = authenticationService.getUserInfo()[0].warehouseSelected;
        vm.enabled = true;
      }

      rTransfer.getReceiptTransfer(vm.query, function(result){
        vm.receiptTransferList  = result.records;

        angular.forEach(vm.receiptTransferList, function(item){

          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();

          rWarehouse.query({id: item.Document_Detail.WarehouseOrigin}, function(res){
            item.WarehouseOrigin = res.name;
          })
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
      });
      bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
    }

    function loadSendTransfer(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'transfer-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = 0;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.warehouse = authenticationService.getUserInfo()[0].warehouseSelected;
        vm.enabled = true;
      }

      rTransfer.query(vm.query, function(result){
        vm.sendTransferList  = result.records;

        angular.forEach(vm.sendTransferList, function(item){
          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
      });
      bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
    }

    function loadTransfer(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'transfer-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = [1];

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.warehouse = authenticationService.getUserInfo()[0].warehouseSelected;
        vm.enabled = true;
      }

      vm.query.typeDoc = 9;

      rDocument.query(vm.query, function(result){
        vm.transferList  = result.records;

        angular.forEach(vm.transferList, function(item){
          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
      });
      bsLoadingOverlayService.stop({referenceId: 'transfer-overlay'});
    }

    function editTransfer(Transfer){
      vm.selectedTransfer = Transfer;
      angular.element('#modalEditTransfer').modal({backdrop: 'static', keyboard: false});
    }

    function sendTransfer(Transfer){
      vm.selectedTransfer = Transfer;
      angular.element('#modalSendTransfer').modal({backdrop: 'static', keyboard: false});
    }

    function receiptTransfer(Transfer){
      vm.selectedTransfer = Transfer;
      angular.element('#modalReceiptTransfer').modal({backdrop: 'static', keyboard: false});
    }

    function closeTransfer(item){
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
              toastr.info('Traslado cerrado satisfactoriamente', {
                onShown: function () {
                  init();
                }
              });
            }, function(error){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error(error.data.message, 'Error al cerrar Traslado');
            });
          }
        });
      }else{
        toastr.error('Traslado debe contener al menos un Producto asociado', 'Error al cerrar Traslado');
      }
    }

    function deleteTransfer(item){
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
            toastr.info('Traslado eliminado satisfactoriamente', {
              onShown: function () {
                loadTransfer();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Traslado');
          });
        }
      });
    }
/*
    function updateStatus(item){
      SweetAlert.swal({
          title:'',
          text: '¿Desea cambiar el estado del registro seleccionado?',
          showCancelButton: true,
          confirmButtonText:'Sí',
          cancelButtonText:'No',
          closeOnConfirm: true,
          closeOnCancel: true,
          allowEscapeKey: false
        },
        function(isConfirm){
          if (isConfirm) {
            rDocument.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadTransfer();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadTransfer();
          }
        }
      );
    }*/

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      if(vm.processTransfer ==0){
        loadTransfer();
      }
      else{
        if(vm.processTransfer == 1){
          loadReceiptTransfer();
        }
        else{
          loadSendTransfer();
        }
      }
    }

    function goToPage (p) {
      vm.pageNum = p;
      if(vm.processTransfer ==0){
        loadTransfer();
      }
      else{
        if(vm.processTransfer == 1){
          loadReceiptTransfer();
        }
        else{
          loadSendTransfer();
        }
      }
    }

    function range (n) {
      return new Array(n);
    }

    function searchTransfer(){
      vm.pageNum = 1;
      if(vm.processTransfer ==0){
        loadTransfer();
      }
      else{
        if(vm.processTransfer == 1){
          loadReceiptTransfer();
        }
        else{
          loadSendTransfer();
        }
      }
    }

    transferEdited = $rootScope.$on('transferEdited', function() {
      vm.query.filter = null;
      if(vm.processTransfer ==0){
        loadTransfer();
      }
      else{
        if(vm.processTransfer == 1){
          loadReceiptTransfer();
        }
        else{
          loadSendTransfer();
        }
      }
    });

    $rootScope.$on('$destroy', transferEdited);

  }
})();
