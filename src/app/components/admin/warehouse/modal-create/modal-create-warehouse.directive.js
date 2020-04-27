(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateWarehouse', utnModalCreateWarehouse);

  /* @ngInject */
  function utnModalCreateWarehouse() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/warehouse/modal-create/modal-create-warehouse.html',
      controller: ModalCreateWarehouseController,
      controllerAs: 'mCreateWarehouse',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateWarehouseController(rWarehouse, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;

      vm.newWarehouse = {status:true};

      vm.createWarehouse = createWarehouse;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newWarehouse.status = true;
      }
      init();

      function createWarehouse(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rWarehouse.save(vm.newWarehouse, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Sucursal registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newWarehouse = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateWarehouse').modal('hide');
              }
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Sucursal');
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
              angular.element('#modalCreateWarehouse').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateWarehouse').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateWarehouse').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.newWarehouse = {};

        init();
      });
    }
  }
})();
