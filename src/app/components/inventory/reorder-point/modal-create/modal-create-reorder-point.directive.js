(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateReorderPoint', utnModalCreateReorderPoint);

  /* @ngInject */
  function utnModalCreateReorderPoint() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/reorder-point/modal-create/modal-create-reorder-point.html',
      controller: ModalCreateReorderPointController,
      controllerAs: 'mCreateReorderPoint',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateReorderPointController(rTransfer, rReorderPoint, SweetAlert, $rootScope, toastr, authenticationService) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.newReorderPoint = {status:true};

      vm.createReorderPoint = createReorderPoint;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;

      function init () {
        vm.warehouse = vm.userConected.warehouseSelected;
        vm.warehouseDescription = vm.warehouse.code+' - ' +vm.warehouse.name;
        vm.newReorderPoint.WarehouseId = vm.warehouse.id;
        vm.newReorderPoint.status = true;
        loadProduct();
      }
      init();

      function loadProduct(){
      vm.query = {warehouseId: vm.newReorderPoint.WarehouseId};
      rTransfer.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

    function searchProduct(filter){
      if(vm.newReorderPoint.WarehouseId != undefined){
        if(filter.search == ''){
          loadProduct();
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.newReorderPoint.WarehouseId };
          rTransfer.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

      function createReorderPoint(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }
        
        vm.newReorderPoint.ProductId = vm.newReorderPoint.productDup.ProductId;

        rReorderPoint.save(vm.newReorderPoint, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Punto de Reorden registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newReorderPoint = {WarehouseId: vm.warehouse.id, status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateReorderPoint').modal('hide');
              }
              $rootScope.$broadcast('reOrderPointEdited');
            }
          });
        },
        function(error){
          vm.newReorderPoint.productId = null;
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          if(error.data.parent.errno && error.data.parent.errno == 1062){
            toastr.error('Punto de Reorden ingresado anteriormente. Verifíque!', 'Error al crear Punto de Reorden');
          }else{
            angular.forEach(error.data.errors, function(item){
              errorNo++;
              errorMsg += errorNo + '-' + item.message + '<br/>';
            })
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Punto de Reorden');
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
              angular.element('#modalCreateReorderPoint').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateReorderPoint').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateReorderPoint').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.newReorderPoint = {};

        init();
      });
    }
  }
})();
