(function() {
  'use strict';

  angular
  .module('utn')
  .controller('UbicationController', UbicationController);

  /** @ngInject */
  function UbicationController(rUbication, $log, $rootScope, SweetAlert, $timeout, $window, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    ubicationEdited;

    vm.query = {};
    vm.newUbication = {};

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

    vm.searchUbication = searchUbication;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadUbication = loadUbication;
    vm.infoUbication = infoUbication;
    vm.createUbication = createUbication;
    vm.updateStatus = updateStatus;
    vm.deleteUbication = deleteUbication;

    function init () {
      loadUbication(vm.sort, vm.direction);
    }
    init();

    function loadUbication(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'ubication-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rUbication.query(vm.query, function(result){
        vm.ubicationList  = result.records;

        angular.forEach(vm.ubicationList, function(item){
          if(item.status == 1){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'ubication-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'ubication-overlay'});
      });
    }

    function createUbication(){
      angular.element('#modalCreateUbication').modal({backdrop: 'static', keyboard: false});
    }

    function infoUbication(ubication){
      vm.selectedUbication = ubication;
      angular.element('#modalInfoUbication').modal({backdrop: 'static', keyboard: false});
    }

    function deleteUbication(item){
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
          rUbication.delete({id:item.id}, function () {
            toastr.info('Ubicación eliminada satisfactoriamente', {
              onShown: function () {
                loadUbication();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Ubicación');
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
            rUbication.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadUbication();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadUbication();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadUbication();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadUbication();
    }

    function range (n) {
      return new Array(n);
    }

    function searchUbication(){
      vm.pageNum = 1;
      loadUbication();
    }

    ubicationEdited = $rootScope.$on('ubicationEdited', function() {
      vm.query.filter = null;
      loadUbication();
    });

    $rootScope.$on('$destroy', ubicationEdited);

  }
})();
