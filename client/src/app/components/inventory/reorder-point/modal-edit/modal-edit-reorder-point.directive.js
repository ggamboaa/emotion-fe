(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditReorderPoint', utnModalEditReorderPoint);

  /* @ngInject */
  function utnModalEditReorderPoint() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/reorder-point/modal-edit/modal-edit-reorder-point.html',
      controller: ModalEditReorderPointController,
      controllerAs: 'mEditReorderPoint',
      bindToController: true,
      scope:{
        selectedReorderPoint: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditReorderPointController(rWarehouse, rReorderPoint, rProduct, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;

      vm.reOrderPointEdited = {status:true};

      vm.editReorderPoint = editReorderPoint;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;



      function init () {
        // vm.reOrderPointEdited.status = true;
        // loadProduct();
      }
      init();

      function reorderPointToEdit(){
        if(vm.selectedReorderPoint){
          rReorderPoint.query({id:vm.selectedReorderPoint.Product.Reorder_Points[0].id}, function(result){
            vm.reOrderPointEdited  = result;
            rWarehouse.query({id: vm.reOrderPointEdited.WarehouseId}, function(result){
              vm.warehouse = result;
              vm.warehouseDescription = vm.warehouse.code+ ' - '+ vm.warehouse.name;
            })

            vm.reOrderPointEdited.status = (vm.reOrderPointEdited.status == 1)?true:false;

            vm.reOrderPointEdited.quantity = vm.selectedReorderPoint.Product.Reorder_Points[0].quantity;
            vm.reOrderPointEdited.product = vm.selectedReorderPoint.Product;
          });

          
        }
      }

      function loadProduct(){
        rProduct.query(function(result){
          vm.productList  = result.records;
        });
      }

      function searchProduct(filter){
        if(filter.search == ''){
          loadProduct();
        }else{
          vm.query = {filter: filter.search};
          rProduct.query(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }

      function editReorderPoint(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rReorderPoint.update(vm.reOrderPointEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Punto de Reorden actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditReorderPoint').modal('hide');
              $rootScope.$broadcast('reOrderPointEdited');
            }
          });
        },
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          if(error.data.parent != undefined){
            toastr.error('Punto de Reorden ingresado anteriormente. Verifíque!', 'Error al editar Punto de Reorden');
          }else{
            angular.forEach(error.data.errors, function(item){
              errorNo++;
              errorMsg += errorNo + '-' + item.message + '<br/>';
            })
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al actualizar el Punto de Reorden');
          }
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
              angular.element('#modalEditReorderPoint').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditReorderPoint').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditReorderPoint').on('shown.bs.modal', function(){
        reorderPointToEdit();
      });

      angular.element('#modalEditReorderPoint').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.reorderPointToEdit = {};
        vm.reOrderPointEdited = {};

        init();
      });
    }
  }
})();
