(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalEditRol', utnModalEditRol);

  /* @ngInject */
  function utnModalEditRol() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/rol/modal-edit/modal-edit-rol.html',
      controller: ModalEditRolController,
      controllerAs: 'mEditRol',
      bindToController: true,
      scope:{
        selectedRol: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditRolController(rRol, SweetAlert, $rootScope, toastr) {
      var vm = this;

      vm.query = {};
      vm.rolEdited = {};

      vm.editRol = editRol;
      vm.dismissModal = dismissModal;

      function init () {
      }
      init();

      function rolToEdit(){
        if(vm.selectedRol){
          rRol.query({id:vm.selectedRol.id}, function(result){
            vm.rolEdited  = result;
            vm.rolEdited.status = (vm.rolEdited.status == 1)? true:false;
          });
        }
      }

      function editRol(form){
        vm.loading = true;
        vm.submitAttempt = false;
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rRol.update(vm.rolEdited, function(){
          vm.rolEdited = {};
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Rol actulizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditRol').modal('hide');
              $rootScope.$broadcast('rolEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Rol');
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
                angular.element('#modalEditRol').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalEditRol').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditRol').on('shown.bs.modal', function(){
        rolToEdit();
      });

      angular.element('#modalEditRol').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.rolToEdit = {};
        init();
      });

    }
  }
})();
