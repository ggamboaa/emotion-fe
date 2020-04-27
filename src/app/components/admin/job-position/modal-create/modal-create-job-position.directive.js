(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateJobPosition', utnModalCreateJobPosition);

  /* @ngInject */
  function utnModalCreateJobPosition() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/job-position/modal-create/modal-create-job-position.html',
      controller: ModalCreateJobPositionController,
      controllerAs: 'mCreateJobPosition',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateJobPositionController(rJobPosition, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;

      vm.newJobPosition = {status:true};

      vm.createJobPosition = createJobPosition;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newJobPosition.status = true;
      }
      init();

      function createJobPosition(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rJobPosition.save(vm.newJobPosition, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Puesto registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newJobPosition = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateJobPosition').modal('hide');
              }
              $rootScope.$broadcast('jobPositionEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Puesto');
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
              angular.element('#modalCreateJobPosition').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateJobPosition').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateJobPosition').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.newJobPosition = {};

        init();
      });
    }
  }
})();
