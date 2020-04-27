(function() {
  'use strict';

  angular
    .module('utn')
    .controller('UserController', UserController);

  /** @ngInject */
  function UserController(rUser, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    userEdited;
    
    vm.query = {};
    vm.newUser = {};

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

    vm.setRecordsPerPage = setRecordsPerPage;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.searchUser = searchUser;

    vm.loadUser = loadUser;
    vm.createUser = createUser;
    vm.editUser = editUser;
    vm.deleteUser = deleteUser;
    vm.updateStatus = updateStatus;

    function init () {
      loadUser(vm.sort, vm.direction);
    }
    init();

    function loadUser(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'user-overlay'});
      
      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;
      
      rUser.query(vm.query, function(result){
        vm.userList  = result.records;

        angular.forEach(vm.userList, function(item){
          if(item.status == '1'){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'user-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'user-overlay'});
      });
    }

    function createUser(){
      angular.element('#modalCreateUser').modal({backdrop: 'static', keyboard: false});
    }

    function editUser(item){
      vm.selectedUser = item;
      angular.element('#modalEditUser').modal({backdrop: 'static', keyboard: false});
    }

    function deleteUser(item){
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
            rUser.delete({id:item.id}, function () {
              toastr.info('Usuario eliminado satisfactoriamente', {
                onShown: function () {
                  loadUser();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al eliminar Usuario');
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
            rUser.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadUser();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadUser();
          }
        }
      );
    }


    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadUser();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadUser();
    }

    function range (n) {
      return new Array(n);
    }

    function searchUser(){
      vm.pageNum = 1;
      loadUser();
    }

    userEdited = $rootScope.$on('userEdited', function() {
      vm.query.filter = null;
      loadUser();
    });

    $rootScope.$on('$destroy', userEdited);

  }
})();
