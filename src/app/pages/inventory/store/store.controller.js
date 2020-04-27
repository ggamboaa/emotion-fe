(function() {
  'use strict';

  angular
  .module('utn')
  .controller('StoreController', StoreController);

  /** @ngInject */
  function StoreController(rDocument, rWarehouse, $log, $rootScope, moment, SweetAlert, bsLoadingOverlayService, toastr, $timeout, $window, PAGINATION_CONFIG, DATE_ISO_FORMAT, authenticationService) {
    var vm = this,
    storeEdited;

    vm.query = {};
    vm.newStore = {};

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
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

    vm.searchStore = searchStore;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadStore = loadStore;
    vm.makeStock = makeStock;
    //vm.deleteStore = deleteStore;
    //vm.updateStatus = updateStatus;

    function init () {
      checkWarehouses();
      //loadStore(vm.sort, vm.direction);
    }
    init();

    function loadStore(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'store-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = [0];
      vm.query.typeDoc = 1;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){ 
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id; 
      }

      rDocument.query(vm.query, function(result){
        vm.storeList  = result.records;

        angular.forEach(vm.storeList, function(item){
          if(item.status == 1){
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
        bsLoadingOverlayService.stop({referenceId: 'store-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'store-overlay'});
      });
      bsLoadingOverlayService.stop({referenceId: 'store-overlay'});
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
      loadStore();
    }

    function makeStock(store){
      vm.selectedStore = store;
      vm.selectedStore.showMe = true;
      angular.element('#modalEditStore').modal({backdrop: 'static', keyboard: false});
    }

    /*function deleteStore(item){
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
          rDocument.delete({id:item.id}, function () {
            toastr.info('Almacenamiento eliminado satisfactoriamente', {
              onShown: function () {
                loadStore();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Almacenamiento');
          });
        }
      }
      );
    }

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
                  loadStore();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadStore();
          }
        }
      );
    }*/

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadStore();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadStore();
    }

    function range (n) {
      return new Array(n);
    }

    function searchStore(){
      vm.pageNum = 1;
      loadStore();
    }

    storeEdited = $rootScope.$on('storeEdited', function() {
      vm.query.filter = null;
      checkWarehouses();
    });

    $rootScope.$on('$destroy', storeEdited);

  }
})();
