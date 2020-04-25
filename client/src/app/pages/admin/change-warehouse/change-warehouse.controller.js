(function() {
  'use strict';

  angular
    .module('utn')
      .controller('ChangeWarehouseController', ChangeWarehouseController);

  /** @ngInject */
    function ChangeWarehouseController(authenticationService, rEmployee, SweetAlert, toastr, $window, $rootScope) {
      var vm = this;
      vm.loading = false;
      vm.submitAttempt = false;
      vm.select = select;
      vm.warehouseList = [];

      function init() {
        loadUserInfo();
        getWarehouseByEmployee();
      }
      init();

      function loadUserInfo(){
        vm.userInfo = authenticationService.getUserInfo();
        vm.userConected = vm.userInfo[0].user;
      }

      function getWarehouseByEmployee(){
        if(vm.userInfo[0].employeeId){
          rEmployee.query({id:vm.userInfo[0].employeeId}, function(result){
            if(result){
              vm.warehouseList = result.Warehouses;
            }
          }, function () {
            toastr.error('Error al obtener datos.');
          });
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
        vm.warehouse = null;
        vm.loading = false;
        vm.submitAttempt = false;
        $rootScope.$broadcast('stateChangeSuccess');
        init();
      }
    }
})();
