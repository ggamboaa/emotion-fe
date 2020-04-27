(function() {
  'use strict';

  angular
  .module('utn')
  .controller('RepairController', RepairController);

  /** @ngInject */
  function RepairController(rRepair, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, moment, PAGINATION_CONFIG, DATE_ISO_FORMAT) {
    var vm = this,
    repairEdited;

    vm.query = {};
    vm.newRepair = {};

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

    vm.searchRepair = searchRepair;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadRepair = loadRepair;
    vm.createRepair = createRepair;
    vm.editRepair = editRepair;
    vm.deleteRepair = deleteRepair;
    vm.updateStatus = updateStatus;

    function init () {
      loadRepair(vm.sort, vm.direction);
    }
    init();

    function loadRepair(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'repair-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rRepair.query(vm.query, function(result){
        vm.repairList  = result.records;

        angular.forEach(vm.repairList, function(item){
          item.damageDate = moment(item.damageDate, DATE_ISO_FORMAT).toDate();
          item.repairDate = moment(item.repairDate, DATE_ISO_FORMAT).toDate();
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'repair-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'repair-overlay'});
      });
    }

    function createRepair(){
      angular.element('#modalCreateRepair').modal({backdrop: 'static', keyboard: false});
    }

    function editRepair(repair){
      vm.selectedRepair = repair;
      angular.element('#modalEditRepair').modal({backdrop: 'static', keyboard: false});
    }

    function deleteRepair(item){
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
          rRepair.delete({id:item.id}, function () {
            toastr.info('Reparación eliminada satisfactoriamente', {
              onShown: function () {
                loadRepair();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Reparación');
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
            rRepair.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadRepair();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadRepair();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadRepair();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadRepair();
    }

    function range (n) {
      return new Array(n);
    }

    function searchRepair(){
      vm.pageNum = 1;
      loadRepair();
    }

    repairEdited = $rootScope.$on('repairEdited', function() {
      vm.query.filter = null;
      loadRepair();
    });

    $rootScope.$on('$destroy', repairEdited);

  }
})();
