(function() {
  'use strict';

  angular
  .module('utn')
  .controller('DepartmentController', DepartmentController);

  /** @ngInject */
  function DepartmentController(rDepartment, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    departmentEdited;

    vm.query = {};
    vm.newDepartment = {};

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

    vm.searchDepartment = searchDepartment;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadDepartment = loadDepartment;
    vm.createDepartment = createDepartment;
    vm.editDepartment = editDepartment;
    vm.deleteDepartment = deleteDepartment;
    vm.updateStatus = updateStatus;

    function init () {
      loadDepartment(vm.sort, vm.direction);
    }
    init();

    function loadDepartment(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'department-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rDepartment.query(vm.query, function(result){
        vm.departmentList  = result.records;

        angular.forEach(vm.departmentList, function(item){
          if(item.status == 1){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'department-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'department-overlay'});
      });
    }

    function createDepartment(){
      angular.element('#modalCreateDepartment').modal({backdrop: 'static', keyboard: false});
    }

    function editDepartment(department){
      vm.selectedDepartment = department;
      angular.element('#modalEditDepartment').modal({backdrop: 'static', keyboard: false});
    }

    function deleteDepartment(item){
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
          rDepartment.delete({id:item.id}, function () {
            toastr.info('Departamento eliminado satisfactoriamente', {
              onShown: function () {
                loadDepartment();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Departamento');
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
            rDepartment.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadDepartment();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadDepartment();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadDepartment();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadDepartment();
    }

    function range (n) {
      return new Array(n);
    }

    function searchDepartment(){
      vm.pageNum = 1;
      loadDepartment();
    }

    departmentEdited = $rootScope.$on('departmentEdited', function() {
      vm.query.filter = null;
      loadDepartment();
    });

    $rootScope.$on('$destroy', departmentEdited);

  }
})();
