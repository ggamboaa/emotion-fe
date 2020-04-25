(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateSaleOrder', utnModalCreateSaleOrder);

  /* @ngInject */
  function utnModalCreateSaleOrder() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sale/sale-order/modal-create/modal-create-sale-order.html',
      controller: ModalCreateSaleOrderController,
      controllerAs: 'mCreateSaleOrder',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateSaleOrderController(rSaleOrder, rEmployee, rDocument, rTypeDocument, rProduct, rCustomer, rWarehouse, SweetAlert, $rootScope, toastr, authenticationService, moment, utilsService) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.dateUI = new Date()
      vm.detailSelectedIndex = -1;

      vm.typeSaleOrderList = [{id:1, name:'Tienda'},{id:2, name:'Mayoreo'}];

      vm.newSaleOrder = {status:true};
      vm.newSaleOrder.productsDetailList = [];
      vm.newSaleOrder.warehouseDup = 0;


      vm.typeDocumentList = [];

      vm.createSaleOrder = createSaleOrder;
      vm.createCustomer = createCustomer;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;
      vm.searchCustomer = searchCustomer;
      vm.searchWarehouse = searchWarehouse;
      vm.setMaxQuantity = setMaxQuantity;



      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;

      vm.loadProduct = loadProduct;

      function init () {
        loadTypeSaleOrder();
        loadCustomer();
        loadWarehouse();

        vm.newSaleOrder.typeDocumentDup = vm.typeDocumentList[4];
        vm.newSaleOrder.status = true;
        vm.newSaleOrder.warehouseDup = vm.userConected.warehouseSelected;
        vm.newSaleOrder.user = vm.userConected.user;
        vm.newSaleOrder.productsDetailList = [];
        vm.newSaleOrder.customerDup = null;
      }
      init();

      function setMaxQuantity(item){
        vm.newSaleOrder.maxQuantity = '';
        vm.itemDetail.quantity = '';
        if(item){
          vm.newSaleOrder.maxQuantity = (item.maximum)?item.maximum:'';
        }
      }

      function createCustomer () {
        angular.element('#modalCreateCustomer').modal({backdrop: 'static', keyboard: false});
      }

      function loadTypeSaleOrder(){
        rTypeDocument.query(function(result){
          vm.typeDocumentList  = result.records;
        });
      }

      function loadWarehouse(){
        rWarehouse.query(function(result){
          vm.warehouseList  = result.records;
        });
      }

      function searchWarehouse(filter){
        if(filter.search == ''){
          loadWarehouse();
        }else{
          vm.query = {filter: filter.search};
          rWarehouse.query(vm.query, function (result) {
            vm.warehouseList = result.records;
          });
        }
      }

      function loadCustomer(){
        rCustomer.query(function(result){
          vm.customerList  = result.records;
        });
      }

      function searchCustomer(filter){
        if(filter.search == ''){
          loadCustomer();
        }else{
          vm.query = {filter: filter.search};
          rCustomer.query(vm.query, function (result) {
            vm.customerList = result.records;
          });
        }
      }

    function loadProduct(pWarehouseId){
      // vm.productList = [];
      // vm.itemDetail = {};
      vm.query = {warehouseId: pWarehouseId};
      rSaleOrder.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

    function searchProduct(filter){
      if(vm.newSaleOrder.warehouseDup != undefined){
        if(filter.search == ''){
          loadProduct(vm.newSaleOrder.warehouseDup.id);
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.newSaleOrder.warehouseDup.id };
          rSaleOrder.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

    function cleanFormDetail() {
      vm.detailSelectedIndex = -1;
      vm.itemDetail = {};
      vm.newSaleOrder.maxQuantity = '';
    }

    function editDetail(index) {

      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.newSaleOrder.productsDetailList[vm.detailSelectedIndex];

      detail.quantity = vm.detailSelectedIndex.quantity;
      vm.newSaleOrder.maxQuantity = vm.detailSelectedIndex.maximum;

      angular.forEach(vm.productList, function(item){
        if(vm.detailSelectedIndex.product.id == item.ProductId){
          detail.product = item;
        }
      })
      vm.detailSelectedIndex = index;
      angular.copy(detail, vm.itemDetail);
    }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if(parseInt(vm.itemDetail.product.maximum)  < vm.itemDetail.quantity){
          vm.newSaleOrder.maxQuantity = '';
          toastr.error('La cantidad máxima que puede solicitar es de '+vm.itemDetail.product.maximum);
          return;
        }

        if (vm.itemDetail.product && vm.itemDetail.quantity){
          // angular.copy(vm.itemDetail, detailToAdd);
          detailToAdd.quantity = vm.itemDetail.quantity;
          detailToAdd.product = vm.itemDetail.product.Product;
          detailToAdd.maximum = vm.itemDetail.product.maximum;

          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(detailToAdd,vm.newSaleOrder.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.newSaleOrder.productsDetailList.push(detailToAdd);
              vm.newSaleOrder.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.newSaleOrder.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(parseInt(vm.itemDetail.product.maximum) < newQuantity){
                    toastr.error('La cantidad máxima que puede solicitar es de '+vm.itemDetail.product.maximum);
                    vm.newSaleOrder.maxQuantity = '';
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.newSaleOrder.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.newSaleOrder.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.addAttempt = false;
            vm.newSaleOrder.maxQuantity = '';
          }
        }else{
          vm.addAttempt = true;
          vm.newSaleOrder.maxQuantity = '';
        }

        vm.detailSelectedIndex = -1;
        vm.itemDetail = {};
        // vm.itemDetail = { amount: 0 };
        //cleanFormDetail();
      }

      function deleteDetail (index) {
        SweetAlert.swal({
            title:'',
            text: '¿Desea eliminar el registro de la lista?',
            showCancelButton: true,
            confirmButtonText:'Sí',
            cancelButtonText:'No',
            closeOnConfirm: true,
            closeOnCancel: true,
            allowEscapeKey: false
          },
          function(isConfirm){
            if (isConfirm) {
              // vm.newSaleOrder.productsDetailList.splice(index, 1);
              if(vm.newSaleOrder.productsDetailList.length == 1){
                toastr.error('Orden de Venta debe contener al menos un producto')
              }
              else{
                vm.newSaleOrder.productsDetailList.splice(index, 1);
              }
            }
          }
        );
      }

      function createSaleOrder(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newSaleOrder.productsDetailList.length < 1 && vm.newSaleOrder.typeDocumentDup.id == 5){
          toastr.error('Orden de Venta debe contener al menos un Producto asociado');
          vm.loading = false;
          return;
        }

        vm.newSaleOrder.ids = [];
        vm.newSaleOrder.quantitys = [];
        angular.forEach(vm.newSaleOrder.productsDetailList, function(item){
          vm.newSaleOrder.ids.push(item.product.id);
          vm.newSaleOrder.quantitys.push(item.quantity);
        })

        vm.newSaleOrder.TypeDocumentId = 5;

        if(vm.dateUI){
          vm.newSaleOrder.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }

        vm.newSaleOrder.WarehouseId = vm.newSaleOrder.warehouseDup.id;
        vm.newSaleOrder.WarehouseOrigin = vm.newSaleOrder.warehouseDup.id;

        rSaleOrder.save(vm.newSaleOrder, function(){
          vm.loading = true;
          vm.submitAttempt = false;
          toastr.success('Orden de venta registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.loading = false;
                vm.newSaleOrder = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateSaleOrder').modal('hide');
              }
              $rootScope.$broadcast('saleOrderEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Orden de venta');
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
              angular.element('#modalCreateSaleOrder').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateSaleOrder').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateSaleOrder').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newSaleOrder = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
