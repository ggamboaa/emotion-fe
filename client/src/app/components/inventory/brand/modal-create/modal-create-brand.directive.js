(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateBrand', utnModalCreateBrand);

  /* @ngInject */
  function utnModalCreateBrand() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/brand/modal-create/modal-create-brand.html',
      controller: ModalCreateBrandController,
      controllerAs: 'mCreateBrand',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateBrandController(rBrand, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;
      vm.newBrand = {status:true};

      vm.createBrand = createBrand;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newBrand.status = true;
      }
      init();

      function createBrand(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rBrand.save(vm.newBrand, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Marca registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newBrand = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateBrand').modal('hide');
              }
              $rootScope.$broadcast('brandEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Marca');
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
              angular.element('#modalCreateBrand').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateBrand').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateBrand').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newBrand = {};
        init();
      });

    }
  }
})();
