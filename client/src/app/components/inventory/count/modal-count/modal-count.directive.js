(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCount', utnModalCount);

  /* @ngInject */
  function utnModalCount() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/count/modal-count/modal-count.html',
      controller: ModalCountController,
      controllerAs: 'mCount',
      bindToController: true,
      scope:{
        selectedItems: '='
      }

    };

    return directive;

    /** @ngInject */
    function ModalCountController(rUbicationProduct, rProduct, rUbication, rWarehouse, rReport, SweetAlert, $rootScope, toastr, authenticationService) {
      var vm = this;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.countEdited = {};
      vm.countEdited.productsDetailList = [];

      vm.dismissModal = dismissModal;
      vm.changeDetail = changeDetail;
      vm.openReport = openReport;

      function init () {
      }
      init();

      function countToEdit(){
        vm.countEdited.productsDetailList = [];
        
        if(vm.selectedItems.length > 0){
        
          rUbicationProduct.getAllByProductIds(vm.selectedItems, function(result){
            if(result.records.length > 0){

              angular.forEach(result.records, function(item){
                var obj = {DocumentId:item.DocumentId, quantity:item.quantity, status:item.status, user:item.user}

                rProduct.query({id:item.ProductId}, function(resProduct){
                  if(resProduct.typeProduct == 1){
                    obj.product = {id:resProduct.id, code:resProduct.code, name:resProduct.name, measure:resProduct.width + '/' + resProduct.series + resProduct.size};
                  }else{
                    obj.product = {id:resProduct.id, code:resProduct.code, name:resProduct.name, measure:resProduct.measure};
                  }
                }, function () {
                  toastr.error('Error al obtener los datos de Producto.');
                });

                rWarehouse.query({id:item.WarehouseId}, function(resWarehouse){
                  obj.warehouse = {id:resWarehouse.id, code:resWarehouse.code, name:resWarehouse.name}
                }, function () {
                  toastr.error('Error al obtener los datos de Producto.');
                });

                rUbication.query({id:item.UbicationId}, function(resUbication){
                  obj.ubication = {id:resUbication.id, name:resUbication.ubicationName};
                }, function () {
                  toastr.error('Error al obtener los datos de Ubicaciones.');
                });

                vm.countEdited.productsDetailList.push(obj);
              });
            }
          }, function () {
            toastr.error('Error al obtener datos.');
          });
        }
      }

      function changeDetail(){
        vm.loading = true;
        vm.addAttempt = true;

        if(vm.selectedItems.showMe){
          vm.itemDetail.showMe = vm.selectedItems.showMe;
        }

        vm.productsList = [];
        angular.forEach(vm.countEdited.productsDetailList, function(item){
          item.UbicationId = item.ubication.id;
          item.ProductId = item.product.id;
          item.WarehouseId = item.warehouse.id;
          item.user = vm.userConected.user;
          
          //item.quantity = 0
          if(item.newQuantity){
            item.quantity = item.newQuantity;
          } 

          vm.productsList.push(item);       
        })

        vm.loading = false;
        vm.addAttempt = false;
        
        rUbicationProduct.doCount(vm.productsList, function(){
          vm.loading = true;
          toastr.success('Conteo realizado satisfactoriamente', {
            onShown: function(){
              vm.loading = false;
              vm.addAttempt = false;
              countToEdit();
            }
          });
        },
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          vm.addAttempt = false;
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al realizar Conteo');
        });
      }

      function openReport(){
        rReport.getUPLReport(vm.countEdited.productsDetailList, function(){
          toastr.info('Reporte generado satisfactoriamente. Guardado en: EMOTION/server/pdf');
        },function () {
          toastr.error('Error al obtener reporte.');
        });
      }

      function dismissModal (form){
        angular.element('#modalCount').modal('hide');
        form.$setPristine();
        $rootScope.$broadcast('countEdited');
      }

      angular.element('#modalCount').on('shown.bs.modal', function(){
        countToEdit();
      });

      angular.element('#modalCount').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.countEdited = {};
        vm.itemDetail = {};
        vm.countEdited.productsDetailList = [];

        init();
      });
    }
  }
})();
