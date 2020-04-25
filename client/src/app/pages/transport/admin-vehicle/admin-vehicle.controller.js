(function() {
  'use strict';

  angular
  .module('utn')
  .controller('AdminVehicleController', AdminVehicleController);

  /** @ngInject */
  function AdminVehicleController(rAdminVehicle, rEmployee, rWarehouse, rUser, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG, DATE_ISO_FORMAT, moment) {
    var vm = this,
    adminVehicleEdited;

    vm.query = {};
    vm.newAdminVehicle = {};

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

    vm.searchAdminVehicle = searchAdminVehicle;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadAdminVehicle = loadAdminVehicle;
    vm.createAdminVehicle = createAdminVehicle;
    vm.editAdminVehicle = editAdminVehicle;
    vm.deleteAdminVehicle = deleteAdminVehicle;
    vm.updateStatus = updateStatus;

    function init () {
      loadWarehouse();
      loadEmployee();
      loadUser();
      loadAdminVehicle(vm.sort, vm.direction);
    }
    init();

    function loadAdminVehicle(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'adminVehicle-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rAdminVehicle.query(vm.query, function(result){
        vm.adminVehicleList  = result.records;

        // // var cont = 0;
        // angular.forEach(vm.adminVehicleList, function(itemAdminV){
        //   if(itemAdminV.status == 0){
        //     // vm.adminVehicleList.splice(itemAdminV, 1)
        //     var index = vm.adminVehicleList.indexOf(itemAdminV);
        //     vm.adminVehicleList.splice(index,1);
        //   }
        //   // cont++;
        // });

        angular.forEach(vm.adminVehicleList, function(item){

          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();

          angular.forEach(vm.employeeList, function(itemEmployee){
            if(item.driverEmployeeId == itemEmployee.id){
              item.driverEmployeeId = itemEmployee.identification +" "+ itemEmployee.name + " " +
              itemEmployee.firstName +" " + itemEmployee.lastName;
            }
          });

          angular.forEach(vm.warehouseList, function(itemWarehouse){
            if(item.warehouseId == itemWarehouse.id){
              item.warehouseId = itemWarehouse.code +" - "+ itemWarehouse.name;
            }
          });

          angular.forEach(vm.userList, function(itemUser){
            if(item.userId == itemUser.id){
              item.userId = itemUser.user;
            }
          });
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'adminVehicle-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'adminVehicle-overlay'});
      });
    }

    function loadEmployee(){
      rEmployee.query(function(result){
        vm.employeeList  = result.records;
      });
    }

    function loadWarehouse(){
      rWarehouse.query(function(result){
        vm.warehouseList  = result.records;
      });
    }

    function loadUser(){
      rUser.query(function(result){
        vm.userList  = result.records;
      });
    }

    function createAdminVehicle(){
      angular.element('#modalCreateAdminVehicle').modal({backdrop: 'static', keyboard: false});
    }

    function editAdminVehicle(adminVehicle){
      vm.selectedAdminVehicle = adminVehicle;
      angular.element('#modalEditAdminVehicle').modal({backdrop: 'static', keyboard: false});
    }

    function deleteAdminVehicle(item){
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
          rAdminVehicle.delete({id:item.id}, function () {
            toastr.info('Vehículo eliminado satisfactoriamente', {
              onShown: function () {
                loadAdminVehicle();
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
            item.status = (item.status == 1)?0:1;
            rAdminVehicle.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Gestión eliminada satisfactoriamente', {
                onShown: function () {
                  loadAdminVehicle();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadAdminVehicle();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadAdminVehicle();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadAdminVehicle();
    }

    function range (n) {
      return new Array(n);
    }

    function searchAdminVehicle(){
      vm.pageNum = 1;
      loadAdminVehicle();
    }

    adminVehicleEdited = $rootScope.$on('adminVehicleEdited', function() {
      vm.query.filter = null;
      loadAdminVehicle();
    });

    $rootScope.$on('$destroy', adminVehicleEdited);

  }
})();
