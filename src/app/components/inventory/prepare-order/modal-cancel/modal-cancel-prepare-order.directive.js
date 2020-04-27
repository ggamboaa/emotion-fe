(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCancelPrepareOrder', utnModalCancelPrepareOrder);

  /* @ngInject */
  function utnModalCancelPrepareOrder() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/prepare-order/modal-cancel/modal-cancel-prepare-order.html',
      controller: ModalCancelPrepareOrderController,
      controllerAs: 'mCancelPrepareOrder',
      bindToController: true,
      scope:{
        selectedPrepareOrder: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalCancelPrepareOrderController(rPrepareOrder, rUbication, rProduct, SweetAlert, $rootScope, toastr, authenticationService) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.prepareOrderCanceled = {status:true};
      vm.cancelPrepareOrder = cancelPrepareOrder;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;



      function init () {
        vm.prepareOrderCanceled.status = true;
        loadProduct();
      }
      init();

      function prepareOrderToCancel(){
        if(vm.selectedPrepareOrder){
          vm.prepareOrderCanceled = vm.selectedPrepareOrder; 
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

      function cancelPrepareOrder(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }


        rPrepareOrder.cancelPrepareOrder(vm.prepareOrderCanceled, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.prepareOrderCanceled = {};
          vm.selectedPrepareOrder = {};
          toastr.success('Alisto aprovado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalCancelPrepareOrder').modal('hide');
              $rootScope.$broadcast('prepareOrderEdited');
            }
          });
        },
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          if(error.data.parent != undefined){
            toastr.error('Alisto aprovado anteriormente. Verifíque!', 'Error al realizar Alisto');
          }else{
            if(error.data.errors != undefined){
              angular.forEach(error.data.errors, function(item){
                errorNo++;
                errorMsg += errorNo + '-' + item.message + '<br/>';
              })
              toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al aprovado el Alisto');
              }
              else{
                toastr.error("Código Incorrecto");
              }
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
              angular.element('#modalCancelPrepareOrder').modal('hide');
              form.$setPristine();
              vm.prepareOrderCanceled = {};
            }
          }
          );
        }else{
          angular.element('#modalCancelPrepareOrder').modal('hide');
          form.$setPristine();
          vm.prepareOrderCanceled = {};
          vm.selectedPrepareOrder = {};
        }
      }

      angular.element('#modalCancelPrepareOrder').on('shown.bs.modal', function(){
        prepareOrderToCancel();
      });

      angular.element('#modalCancelPrepareOrder').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.prepareOrderToCancel = {};
        vm.prepareOrderCanceled = {};
        init();
      });
    }
  }
})();
