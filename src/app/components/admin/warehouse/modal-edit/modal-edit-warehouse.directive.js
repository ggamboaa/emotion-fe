(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditWarehouse', utnModalEditWarehouse);

  /* @ngInject */
  function utnModalEditWarehouse() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/warehouse/modal-edit/modal-edit-warehouse.html',
      controller: ModalEditWarehouseController,
      controllerAs: 'mEditWarehouse',
      bindToController: true,
      scope:{
        selectedWarehouse: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditWarehouseController(rWarehouse, SweetAlert, $rootScope, toastr) {
      var vm = this;

      vm.warehouseEdited = {};

      vm.editWarehouse = editWarehouse;
      vm.dismissModal = dismissModal;

      function init () {
      }
      init();

      function warehouseToEdit(){
        if(vm.selectedWarehouse){
          rWarehouse.query({id:vm.selectedWarehouse.id}, function(result){
            vm.warehouseEdited  = result;
            vm.warehouseEdited.status = (vm.warehouseEdited.status == 1)? true:false;
          });
        }
      }

      function editWarehouse(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rWarehouse.update(vm.warehouseEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Sucursal actualizada satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditWarehouse').modal('hide');
              $rootScope.$broadcast('warehouseEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Sucursal');
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
              angular.element('#modalEditWarehouse').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditWarehouse').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditWarehouse').on('shown.bs.modal', function(){
        warehouseToEdit();
      });

      angular.element('#modalEditWarehouse').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.warehouseToEdit = {};
        init();
      });

    }
  }
})();
