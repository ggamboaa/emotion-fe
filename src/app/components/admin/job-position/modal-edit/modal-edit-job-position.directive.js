(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditJobPosition', utnModalEditJobPosition);

  /* @ngInject */
  function utnModalEditJobPosition() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/job-position/modal-edit/modal-edit-job-position.html',
      controller: ModalEditJobPositionController,
      controllerAs: 'mEditJobPosition',
      bindToController: true,
      scope:{
        selectedJobPosition: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditJobPositionController(rJobPosition, SweetAlert, $rootScope, toastr) {
      var vm = this;

      vm.jobPositionEdited = {};

      vm.editJobPosition = editJobPosition;
      vm.dismissModal = dismissModal;

      function init () {
      }
      init();

      function jobPositionToEdit(){
        if(vm.selectedJobPosition){
          rJobPosition.query({id:vm.selectedJobPosition.id}, function(result){
            vm.jobPositionEdited  = result;
            vm.jobPositionEdited.status = (vm.jobPositionEdited.status == 1)? true:false;
          });
        }
      }

      function editJobPosition(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rJobPosition.update(vm.jobPositionEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Puesto actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditJobPosition').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Puesto');
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
              angular.element('#modalEditJobPosition').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditJobPosition').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditJobPosition').on('shown.bs.modal', function(){
        jobPositionToEdit();
      });

      angular.element('#modalEditJobPosition').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.jobPositionToEdit = {};
        init();
      });

    }
  }
})();
