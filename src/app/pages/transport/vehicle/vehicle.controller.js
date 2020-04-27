(function() {
  'use strict';

  angular
  .module('utn')
  .controller('VehicleController', VehicleController);

  /** @ngInject */
  function VehicleController(rVehicle, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    vehicleEdited;

    vm.query = {};
    vm.newVehicle = {};

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

    vm.searchVehicle = searchVehicle;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadVehicle = loadVehicle;
    vm.createVehicle = createVehicle;
    vm.editVehicle = editVehicle;
    vm.deleteVehicle = deleteVehicle;
    vm.updateStatus = updateStatus;

    function init () {
      loadVehicle(vm.sort, vm.direction);
    }
    init();

    function loadVehicle(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'vehicle-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rVehicle.query(vm.query, function(result){
        vm.vehicleList  = result.records;

        angular.forEach(vm.vehicleList, function(item){
          
          if(item.status == 1){
            item.status = true;
          }
          
          if(item.transmissionType == 1){
            item.transmissionTypeName = "Manual";
          }else{
            item.transmissionTypeName = "Automático";
          }

          if(item.vehicleType){
            var action = parseInt(item.vehicleType);
            switch (action) {
              case 1:
                item.vehicleTypeName = "Particular";
                break;
              case 2:
                item.vehicleTypeName = "Carga Liviana";
                break;
              case 3:
                item.vehicleTypeName = "Carga Pesada";
                break;
              case 4:
                item.vehicleTypeName = "Moto";
                break;
            }
          }

        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'vehicle-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'vehicle-overlay'});
      });
    }

    function createVehicle(){
      angular.element('#modalCreateVehicle').modal({backdrop: 'static', keyboard: false});
    }

    function editVehicle(vehicle){
      vm.selectedVehicle = vehicle;
      angular.element('#modalEditVehicle').modal({backdrop: 'static', keyboard: false});
    }

    function deleteVehicle(item){
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
          rVehicle.delete({id:item.id}, function () {
            toastr.info('Vehículo eliminado satisfactoriamente', {
              onShown: function () {
                loadVehicle();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Vehículo');
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
            rVehicle.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadVehicle();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadVehicle();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadVehicle();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadVehicle();
    }

    function range (n) {
      return new Array(n);
    }

    function searchVehicle(){
      vm.pageNum = 1;
      loadVehicle();
    }

    vehicleEdited = $rootScope.$on('vehicleEdited', function() {
      vm.query.filter = null;
      loadVehicle();
    });

    $rootScope.$on('$destroy', vehicleEdited);

  }
})();
