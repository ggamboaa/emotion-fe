(function() {
  'use strict';

  angular
  .module('utn')
  .controller('JobPositionController', JobPositionController);

  /** @ngInject */
  function JobPositionController(rJobPosition, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    jobPositionEdited;

    vm.query = {};
    vm.newJobPosition = {};

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

    vm.searchJobPosition = searchJobPosition;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadJobPosition = loadJobPosition;
    vm.createJobPosition = createJobPosition;
    vm.editJobPosition = editJobPosition;
    vm.deleteJobPosition = deleteJobPosition;
    vm.updateStatus = updateStatus;

    function init () {
      loadJobPosition(vm.sort, vm.direction);
    }
    init();

    function loadJobPosition(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'jobPosition-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rJobPosition.query(vm.query, function(result){
        vm.jobPositionList  = result.records;

        angular.forEach(vm.jobPositionList, function(item){
          if(item.status == '1'){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'jobPosition-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'jobPosition-overlay'});
      });
    }

    function createJobPosition(){
      angular.element('#modalCreateJobPosition').modal({backdrop: 'static', keyboard: false});
    }

    function editJobPosition(item){
      vm.selectedJobPosition = item;
      angular.element('#modalEditJobPosition').modal({backdrop: 'static', keyboard: false});
    }

    function deleteJobPosition(item){
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
          rJobPosition.delete({id:item.id}, function () {
            toastr.info('Puesto eliminado satisfactoriamente', {
              onShown: function () {
                loadJobPosition();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar el Puesto');
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
            rJobPosition.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadJobPosition();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadJobPosition();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadJobPosition();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadJobPosition();
    }

    function range (n) {
      return new Array(n);
    }

    function searchJobPosition(){
      vm.pageNum = 1;
      loadJobPosition();
    }

    jobPositionEdited = $rootScope.$on('jobPositionEdited', function() {
      vm.query.filter = null;
      loadJobPosition();
    });

    $rootScope.$on('$destroy', jobPositionEdited);

  }
})();
