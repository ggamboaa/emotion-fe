(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditPrepareOrder', utnModalEditPrepareOrder);

  /* @ngInject */
  function utnModalEditPrepareOrder() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/prepare-order/modal-edit/modal-edit-prepare-order.html',
      controller: ModalEditPrepareOrderController,
      controllerAs: 'mEditPrepareOrder',
      bindToController: true,
      scope:{
        selectedPrepareOrder: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditPrepareOrderController(rPrepareOrder, rUbication, rProduct, SweetAlert, $rootScope, toastr, authenticationService) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.prepareOrderEdited = {status:true};
      vm.editPrepareOrder = editPrepareOrder;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;
      vm.selectedItemDetail = selectedItemDetail;



      function init () {
        vm.prepareOrderEdited.status = true;
        loadProduct();
      }
      init();

      function prepareOrderToEdit(){
        if(vm.selectedPrepareOrder){
          rPrepareOrder.getInventoryProducts({id:vm.selectedPrepareOrder.id,ProductId: vm.selectedPrepareOrder.ProductId, WarehouseId: vm.selectedPrepareOrder.WarehouseId}, function(result){
            vm.prepareOrderEdited  = result;
            vm.prepareOrderEdited.typeDocument = vm.selectedPrepareOrder.documentSelected.TypeDocumentId;
            vm.prepareOrderEdited.productsDetailList = [];
            vm.ubicationList = [];
            angular.forEach(vm.prepareOrderEdited.records, function(item){
              vm.prepareOrderEdited.productsDetailList.push(item);
              vm.ubicationList.push(item.Ubication);
            });
          });
        }
      }

      function selectedItemDetail(item){
        vm.itemDetail = item;
        if (item.quantity > (vm.selectedPrepareOrder.quantity * -1)){
          vm.itemDetail.newQuantity = vm.selectedPrepareOrder.quantity * -1;
        }else{
          vm.itemDetail.newQuantity = item.quantity;
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

      function editPrepareOrder(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.itemDetail.newQuantity > (vm.selectedPrepareOrder.quantity * -1)){
          toastr.error('La cantidad no puede ser mayor de la solicitada');
          vm.loading = false;
          return;
        }

        if(vm.itemDetail.quantity < vm.itemDetail.newQuantity){
          toastr.error('La cantidad no puede ser mayor a la Ubicación');
          vm.loading = false;
          return;
        }

        vm.prepareOrderEdited.itemDetail = vm.itemDetail;
        vm.prepareOrderEdited.selectedPrepareOrder = vm.selectedPrepareOrder;
        vm.prepareOrderEdited.user = vm.userConected.user;


        rPrepareOrder.save(vm.prepareOrderEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.itemDetail = {};
          vm.selectedPrepareOrder = {};
          toastr.success('Alisto realizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditPrepareOrder').modal('hide');
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
            toastr.error('Alisto realizado anteriormente. Verifíque!', 'Error al realizar Alisto');
          }else{
            angular.forEach(error.data.errors, function(item){
              errorNo++;
              errorMsg += errorNo + '-' + item.message + '<br/>';
            })
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al relizar el Alisto');
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
              angular.element('#modalEditPrepareOrder').modal('hide');
              form.$setPristine();
              vm.itemDetail = {};
            }
          }
          );
        }else{
          angular.element('#modalEditPrepareOrder').modal('hide');
          form.$setPristine();
          vm.itemDetail = {};
          vm.selectedPrepareOrder = {};
        }
      }

      angular.element('#modalEditPrepareOrder').on('shown.bs.modal', function(){
        prepareOrderToEdit();
      });

      angular.element('#modalEditPrepareOrder').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.prepareOrderToEdit = {};
        vm.prepareOrderEdited = {};
        init();
      });
    }
  }
})();
