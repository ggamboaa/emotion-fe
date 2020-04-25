(function() {
  'use strict';

  angular
  .module('utn')
  .controller('RolController', RolController);

  /** @ngInject */
  function RolController(rRol, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    rolEdited;

    vm.query = {};
    vm.newRol = {};

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

    vm.searchRol = searchRol;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadRol = loadRol;
    vm.createRol = createRol;
    vm.editRol = editRol;
    vm.deleteRol = deleteRol;
    vm.updateStatus = updateStatus;

    function init () {
      loadRol(vm.sort, vm.direction);
    }
    init();

    function loadRol(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'rol-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rRol.query(vm.query, function(result){
        vm.rolList  = result.records;

        angular.forEach(vm.rolList, function(item){
          if(item.status == '1'){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'rol-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'rol-overlay'});
      });
    }

    function createRol(){
      angular.element('#modalCreateRol').modal({backdrop: 'static', keyboard: false});
    }

    function editRol(rol){
      vm.selectedRol = rol;
      angular.element('#modalEditRol').modal({backdrop: 'static', keyboard: false});
    }

    function deleteRol(item){
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
          rRol.delete({id:item.id}, function () {
            toastr.info('Rol eliminado satisfactoriamente', {
              onShown: function () {
                loadRol();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Rol');
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
            rRol.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadRol();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadRol();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadRol();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadRol();
    }

    function range (n) {
      return new Array(n);
    }

    function searchRol(){
      vm.pageNum = 1;
      loadRol();
    }

    rolEdited = $rootScope.$on('rolEdited', function() {
      vm.query.filter = null;
      loadRol();
    });

    $rootScope.$on('$destroy', rolEdited);

  }
})();
