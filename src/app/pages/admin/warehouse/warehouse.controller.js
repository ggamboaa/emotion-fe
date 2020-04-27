(function() {
  'use strict';

  angular
  .module('utn')
  .controller('WarehouseController', WarehouseController);

  /** @ngInject */
  function WarehouseController(rWarehouse, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    warehouseEdited;

    vm.query = {};
    vm.newWarehouse = {};

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

    vm.searchWarehouse = searchWarehouse;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadWarehouse = loadWarehouse;
    vm.createWarehouse = createWarehouse;
    vm.editWarehouse = editWarehouse;
    vm.deleteWarehouse = deleteWarehouse;
    vm.updateStatus = updateStatus;

    function init () {
      loadWarehouse(vm.sort, vm.direction);
    }
    init();

    function loadWarehouse(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'warehouse-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rWarehouse.query(vm.query, function(result){
        vm.warehouseList  = result.records;

        angular.forEach(vm.warehouseList, function(item){
          if(item.status == '1'){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'warehouse-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'warehouse-overlay'});
      });
    }

    function createWarehouse(){
      angular.element('#modalCreateWarehouse').modal({backdrop: 'static', keyboard: false});
    }

    function editWarehouse(warehouse){
      vm.selectedWarehouse = warehouse;
      angular.element('#modalEditWarehouse').modal({backdrop: 'static', keyboard: false});
    }

    function deleteWarehouse(item){
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
          rWarehouse.delete({id:item.id}, function () {
            toastr.info('Sucursal eliminada satisfactoriamente', {
              onShown: function () {
                loadWarehouse();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar el Sucursal');
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
            rWarehouse.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadWarehouse();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadWarehouse();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadWarehouse();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadWarehouse();
    }

    function range (n) {
      return new Array(n);
    }

    function searchWarehouse(){
      vm.pageNum = 1;
      loadWarehouse();
    }

    warehouseEdited = $rootScope.$on('warehouseEdited', function() {
      vm.query.filter = null;
      loadWarehouse();
    });

    $rootScope.$on('$destroy', warehouseEdited);

  }
})();
