(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalEditUser', utnModalEditUser);

  /* @ngInject */
  function utnModalEditUser() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/user/modal-edit/modal-edit-user.html',
      controller: ModalEditUserController,
      controllerAs: 'mEditUser',
      bindToController: true,
      scope:{
        selectedUser: '='
      }
    };

    return directive;

    /* @ngInject */
    function ModalEditUserController(rUser, rRol, rEmployee, $log, utilsService, authenticationService, SweetAlert, toastr, $rootScope) {
      var vm = this;
      vm.loading = false;
      vm.submitAttempt = false;
      vm.status = true;
      vm.showPass = false; 
      
      vm.roleUserList = [];
      vm.itemsSelected = [];

      vm.userEdited = {};

      vm.edit = edit;
      vm.searchEmployee = searchEmployee;
      vm.dismissModal = dismissModal;
      vm.showPassword = showPassword;
      vm.checkItem = checkItem;
      vm.setUser = setUser;

      function init() {
        vm.itemsSelected = [];
  
        loadRols();
        loadEmployee();
      }

      function setUser(){
        if(vm.userEdited.employee){
          var sName = vm.userEdited.employee.name;
          var sLastName = vm.userEdited.employee.lastName;
          vm.userEdited.user = sName.charAt(0).toLowerCase() + '' + vm.userEdited.employee.firstName.toLowerCase() +  sLastName.charAt(0).toLowerCase();
        }
      }

      function userToEdit(){
        if(vm.selectedUser){
          rUser.query({id:vm.selectedUser.id}, function(result){
            vm.userEdited  = result;

            vm.userEdited.status = (vm.userEdited.status == 1)? true:false;

            checkSelectedItems();
          });
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

      function checkSelectedItems(){
        angular.forEach(vm.roleUserList, function(itemSelect){
          angular.forEach(vm.userEdited.Rols, function(itemSave){
            if(itemSelect.id == itemSave.id){
              itemSelect.check = true;
              vm.itemsSelected.push(itemSave.id);
            }
          });
        });
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

      function edit(form){
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

        vm.userEdited.ids = vm.itemsSelected;

        if(vm.userEdited.employee){
          vm.userEdited.employeeId = vm.userEdited.employee.id; 
        }

        rUser.update(vm.userEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Usuario actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditUser').modal('hide');
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
            toastr.error("Ajuste(s): " + errorMsg, 'Error al editar Usuario');
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
                angular.element('#modalEditUser').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalEditUser').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditUser').on('shown.bs.modal', function(){
        userToEdit();
      });

      angular.element('#modalEditUser').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.userEdited = {};
        vm.roleUserList = [];
        vm.itemsSelected = [];
        vm.active = 0;

        init();
      });
  }
}

})();
