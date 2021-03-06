(function() {
  'use strict';

  angular
  .module('utn')
  .controller('EmployeeController', EmployeeController);

  /** @ngInject */
  function EmployeeController(rEmployee, rReport, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    employeeEdited;
    vm.cont = 0;
    vm.query = {};
    vm.newEmployee = {};

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

    vm.searchEmployee = searchEmployee;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadEmployee = loadEmployee;
    vm.createEmployee = createEmployee;
    vm.editEmployee = editEmployee;
    vm.deleteEmployee = deleteEmployee;
    vm.updateStatus = updateStatus;
    vm.openReport = openReport;

    function init () {
      loadEmployee(vm.sort, vm.direction);
    }
    init();

    function loadEmployee(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'employee-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rEmployee.query(vm.query, function(result){
        vm.employeeList  = result.records;

        angular.forEach(vm.employeeList, function(item){
          if(item.status == 1){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'employee-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'employee-overlay'});
      });
    }

    function createEmployee(){
      angular.element('#modalCreateEmployee').modal({backdrop: 'static', keyboard: false});
    }

    function editEmployee(employee){
      vm.selectedEmployee = employee;
      angular.element('#modalEditEmployee').modal({backdrop: 'static', keyboard: false});
    }

    function deleteEmployee(item){
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
          rEmployee.delete({id:item.id}, function () {
            toastr.info('Empleado eliminado satisfactoriamente', {
              onShown: function () {
                loadEmployee();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Empleado');
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
            rEmployee.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadEmployee();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadEmployee();
          }
        }
      );
    }

    function openReport(){
      vm.query = {};
      rReport.getEmployeeReport(vm.query, function(){
        toastr.info('Reporte generado satisfactoriamente. Guardado en: EMOTION/server/pdf');
      },function () {
        toastr.error('Error al obtener reporte.');
      });
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadEmployee();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadEmployee();
    }

    function range (n) {
      return new Array(n);
    }

    function searchEmployee(){
      vm.pageNum = 1;
      loadEmployee();
    }

    employeeEdited = $rootScope.$on('employeeEdited', function() {
      vm.query.filter = null;
      loadEmployee();
    });

    $rootScope.$on('$destroy', employeeEdited);

  }
})();
