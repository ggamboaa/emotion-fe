(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalSelectWarehouse', utnModalSelectWarehouse);

  /* @ngInject */
  function utnModalSelectWarehouse() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/warehouse/select-warehouse/modal-select-warehouse.html',
      controller: ModalSelectWarehouseController,
      controllerAs: 'mSelectWarehouse',
      bindToController: true
    };

    return directive;

    /* @ngInject */
    function ModalSelectWarehouseController(authenticationService, SweetAlert, toastr, $window, $rootScope) {
      var vm = this;
      vm.loading = false;
      vm.submitAttempt = false;
      vm.select = select;
      vm.warehouseList = [];

      vm.dismissModal = dismissModal;

      function init() {
        loadUserInfo();
      }

      function loadUserInfo(){
        vm.userInfo = authenticationService.getUserInfo();
        if(vm.userInfo){
          vm.warehouseList = vm.userInfo.warehouseList;
          vm.user = vm.userInfo[0].user;
        }
      }

      function select(form){
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }
        authenticationService.getUserInfo()[0].warehouseSelected = vm.warehouse;
        $window.localStorage['userInfo'] = angular.toJson(authenticationService.getUserInfo());
        toastr.success('Sucursal seleccionada satisfactoriamente');
        angular.element('#modalSelectWarehouse').modal('hide');
        $rootScope.$broadcast('documentEdited');
        $rootScope.$broadcast('saleOrderEdited');
        $rootScope.$broadcast('reOrderPointEdited');
        vm.loading = false;
        vm.submitAttempt = false;
      }

      function dismissModal (form){
        if(!form.$pristine) {
          SweetAlert.swal({
              title:'',
              text: '¿Esta seguro de salir sin seleccionar usuario?',
              showCancelButton: true,
              confirmButtonText:'Sí',
              cancelButtonText:'No',
              closeOnConfirm: true,
              closeOnCancel: true,
              allowEscapeKey: false
            },
            function(isConfirm){
              if (isConfirm) {
                angular.element('#modalSelectWarehouse').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalSelectWarehouse').modal('hide');
          form.$setPristine();
        }
      }


      angular.element('#modalSelectWarehouse').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        init();
      });

      angular.element('#modalSelectWarehouse').on('shown.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        init();
      });

      angular.element('#modalSelectWarehouse').on('hidden.bs.modal', function () {
      });
    }
  }

})();
