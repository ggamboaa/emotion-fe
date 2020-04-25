(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateDepartment', utnModalCreateDepartment);

  /* @ngInject */
  function utnModalCreateDepartment() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/department/modal-create/modal-create-department.html',
      controller: ModalCreateDepartmentController,
      controllerAs: 'mCreateDepartment',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateDepartmentController(rDepartment, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;

      vm.newDepartment = {status:true};

      vm.createDepartment = createDepartment;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newDepartment.status = true;
      }
      init();

      function createDepartment(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rDepartment.save(vm.newDepartment, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Departmento registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newDepartment = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateDepartment').modal('hide');
              }
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Departamento');
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
              angular.element('#modalCreateDepartment').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateDepartment').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateDepartment').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.newDepartment = {};

        init();
      });
    }
  }
})();
