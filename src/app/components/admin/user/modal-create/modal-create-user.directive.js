(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalCreateUser', utnModalCreateUser);

  /* @ngInject */
  function utnModalCreateUser() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/user/modal-create/modal-create-user.html',
      controller: ModalCreateUserController,
      controllerAs: 'mCreateUser',
      bindToController: true
    };

    return directive;

    /* @ngInject */
    function ModalCreateUserController(rUser, rRol, rEmployee, $log, utilsService, authenticationService, SweetAlert, toastr, $rootScope) {
      var vm = this;
      vm.loading = false;
      vm.submitAttempt = false;
      vm.status = true;
      vm.showPass = false; 
      
      vm.newUser = {status:true};
      vm.roleUserList = [];
      vm.itemsSelected = [];

      vm.create = create;
      vm.searchEmployee = searchEmployee; 
      vm.dismissModal = dismissModal;
      vm.showPassword = showPassword;
      vm.checkItem = checkItem;
      vm.setUser = setUser;

      function init() {
        vm.itemsSelected = [];
        vm.newUser.status = true;
  
        loadRols();
        loadEmployee();
      }

      function setUser(){
        if(vm.newUser.employee){
          var sName = vm.newUser.employee.name;
          var sLastName = vm.newUser.employee.lastName;
          vm.newUser.user = sName.charAt(0).toLowerCase() + '' + vm.newUser.employee.firstName.toLowerCase() + sLastName.charAt(0).toLowerCase();
        }
      }

      function loadRols(){
        vm.query = {pagesize:50};
        rRol.query(vm.query, function (result) {
          vm.roleUserList = result.records;
        });
      }

      function loadEmployee(){
        rEmployee.query(function(result){
          vm.employeeList  = result.records;
        });
      }

      function searchEmployee(filter){
        if(filter.search == ''){
          loadEmployee();
        }else{
          vm.query = {filter: filter.search};
          rEmployee.query(vm.query, function (result) {
            vm.employeeList = result.records;
          });
        }
      }

      function showPassword(){
        vm.showPass = false;
        if(vm.chkShowPass){
          vm.showPass = true;
        }
      }

      function checkItem(role) {
        if (!containsItem(role)) {
          vm.itemsSelected.push(role.id);
        }else{
          removeItem(role);
        }
      }

      function containsItem(item) {
        var items = vm.itemsSelected;
        for (var i = 0; i < items.length; i++) {
          if (items[i] === item.id) {
            return true;
          }
        }
        return false;
      }

      function removeItem(item) {
        var array = vm.itemsSelected;
        for (var i in array) {
          if (array[i] == item.id) {
            vm.itemsSelected.splice(i, 1);
            break;
          }
        }
      }

      function create(form,isNewRequired){
        vm.loading = true;
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if (vm.itemsSelected.length === 0) {
          vm.loading = false;
          toastr.error('Debe asignar al menos un rol');
          return;
        }

        vm.newUser.ids = vm.itemsSelected;

        if(vm.newUser.employee){
          vm.newUser.employeeId = vm.newUser.employee.id; 
        }

        rUser.save(vm.newUser, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Usuario Creado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newUser = {status:true};
                vm.itemsSelected = [];
                form.$setPristine();
              }else{
                angular.element('#modalCreateUser').modal('hide');
              }
              $rootScope.$broadcast('userEdited');
            }
          });
        }, function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          if(error.data.parent.errno && error.data.parent.errno == 1062){
            toastr.error('Usuario ya ha sido registrado. Verifíque!', 'Error al crear Usuario');
          }else{
            angular.forEach(error.data.errors, function(item){
              errorNo++;
              errorMsg += errorNo + '-' + item.message + '<br/>';
            })
            toastr.error("Ajuste(s): " + errorMsg, 'Error al crear Usuario');
          }
        });
      }

      function dismissModal (form){
        if(!form.$pristine) {
          SweetAlert.swal({
              title:'',
              text: '¿Esta seguro de salir sin guardar?',
              showCancelButton: true,
              confirmButtonText:'Sí',
              cancelButtonText:'No',
              closeOnConfirm: true,
              closeOnCancel: true,
              allowEscapeKey: false
            },
            function(isConfirm){
              if (isConfirm) {
                angular.element('#modalCreateUser').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalCreateUser').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateUser').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.newUser = {};
        vm.roleUserList = [];
        vm.itemsSelected = [];
        vm.active = 0;

        init();
      });
  }
}

})();
