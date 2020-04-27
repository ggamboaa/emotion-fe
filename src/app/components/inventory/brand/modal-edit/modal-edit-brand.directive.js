(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditBrand', utnModalEditBrand);

  /* @ngInject */
  function utnModalEditBrand() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/brand/modal-edit/modal-edit-brand.html',
      controller: ModalEditBrandController,
      controllerAs: 'mEditBrand',
      bindToController: true,
      scope:{
        selectedBrand: '='
      }

    };

    return directive;

    /** @ngInject */
    function ModalEditBrandController(rBrand, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;
      vm.brandEdited = {status:true};

      vm.brandEdited = {};

      vm.editBrand = editBrand;
      vm.dismissModal = dismissModal;

      function init () {
        vm.brandEdited.status = true;
      }
      init();

      function brandToEdit(){
        if(vm.selectedBrand){
          rBrand.query({id:vm.selectedBrand.id}, function(result){
            vm.brandEdited  = result;
            vm.brandEdited.status = (vm.brandEdited.status == 1)? true:false;
          });
        }
      }

      function editBrand(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rBrand.update(vm.brandEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Marca actalizada satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditBrand').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Marca');
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
              angular.element('#modalEditBrand').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditBrand').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditBrand').on('shown.bs.modal', function(){
        brandToEdit();
      });

      angular.element('#modalEditBrand').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.brandToEdit = {};
        vm.brandEdited = {};

        init();
      });
    }
  }
})();
