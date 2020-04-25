(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalCreateRol', utnModalCreateRol);

  /* @ngInject */
  function utnModalCreateRol() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/rol/modal-create/modal-create-rol.html',
      controller: ModalCreateRolController,
      controllerAs: 'mCreateRol',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateRolController(rRol, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;

      vm.newRol = {};
      vm.newRol = {status:true};

      vm.createRol = createRol;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newRol.status = true;
      }
      init();

      function createRol(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rRol.save(vm.newRol, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Rol registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newRol = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateRol').modal('hide');
              }
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Rol');
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
                angular.element('#modalCreateRol').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalCreateRol').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateRol').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.newRol = {};

        init();
      });
    }
  }
})();
