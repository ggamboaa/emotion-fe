(function() {
  'use strict';

  angular
  .module('utn')
  .controller('OilController', OilController);

  /** @ngInject */
  function OilController(rOil, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, moment, PAGINATION_CONFIG, DATE_ISO_FORMAT) {
    var vm = this,
    oilEdited;

    vm.query = {};
    vm.newOil = {};

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

    vm.searchOil = searchOil;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadOil = loadOil;
    vm.createOil = createOil;
    vm.editOil = editOil;
    vm.deleteOil = deleteOil;
    vm.updateStatus = updateStatus;

    function init () {
      loadOil(vm.sort, vm.direction);
    }
    init();

    function loadOil(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'oil-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rOil.query(vm.query, function(result){
        vm.oilList  = result.records;

        angular.forEach(vm.oilList, function(item){
          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'oil-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'oil-overlay'});
      });
    }

    function createOil(){
      angular.element('#modalCreateOil').modal({backdrop: 'static', keyboard: false});
    }

    function editOil(oil){
      vm.selectedOil = oil;
      angular.element('#modalEditOil').modal({backdrop: 'static', keyboard: false});
    }

    function deleteOil(item){
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
          rOil.delete({id:item.id}, function () {
            toastr.info('Cambio de Aceite eliminado satisfactoriamente', {
              onShown: function () {
                loadOil();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Cambio de Aceite');
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
            rOil.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadOil();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadOil();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadOil();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadOil();
    }

    function range (n) {
      return new Array(n);
    }

    function searchOil(){
      vm.pageNum = 1;
      loadOil();
    }

    oilEdited = $rootScope.$on('oilEdited', function() {
      vm.query.filter = null;
      loadOil();
    });

    $rootScope.$on('$destroy', oilEdited);

  }
})();
