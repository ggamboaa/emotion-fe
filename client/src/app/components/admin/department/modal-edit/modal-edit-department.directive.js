(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditDepartment', utnModalEditDepartment);

  /* @ngInject */
  function utnModalEditDepartment() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/department/modal-edit/modal-edit-department.html',
      controller: ModalEditDepartmentController,
      controllerAs: 'mEditDepartment',
      bindToController: true,
      scope:{
        selectedDepartment: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditDepartmentController(rDepartment, SweetAlert, $rootScope, toastr) {
      var vm = this;

      vm.departmentEdited = {};

      vm.editDepartment = editDepartment;
      vm.dismissModal = dismissModal;

      function init () {
      }
      init();

      function departmentToEdit(){
        if(vm.selectedDepartment){
          rDepartment.query({id:vm.selectedDepartment.id}, function(result){
            vm.departmentEdited  = result;
            vm.departmentEdited.status = (vm.departmentEdited.status == 1)? true:false;
          });
        }
      }

      function editDepartment(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rDepartment.update(vm.departmentEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Departmento actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditDepartment').modal('hide');
              $rootScope.$broadcast('departmentEdited');
            }
          });
        }, 
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Departamento');
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
              angular.element('#modalEditDepartment').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditDepartment').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditDepartment').on('shown.bs.modal', function(){
        departmentToEdit();
      });

      angular.element('#modalEditDepartment').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.departmentToEdit = {};
        init();
      });

    }
  }
})();
