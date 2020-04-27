(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditSaleOrder', utnModalEditSaleOrder);

  /* @ngInject */
  function utnModalEditSaleOrder() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sale/sale-order/modal-edit/modal-edit-sale-order.html',
      controller: ModalEditSaleOrderController,
      controllerAs: 'mEditSaleOrder',
      bindToController: true,
      scope:{
        selectedSaleOrder: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditSaleOrderController(rSaleOrder, rDocument, rTypeDocument, rProduct, rCustomer, rWarehouse, SweetAlert, $rootScope, toastr, authenticationService, moment, utilsService, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      vm.userConected = userInfo[0].user;

      vm.typeSaleOrderList = [{id:1, name:'Tienda'},{id:2, name:'Mayoreo'}];

      vm.dateUI = new Date()
      vm.detailSelectedIndex = -1;

      vm.saleOrderEdited = {status:true};
      vm.saleOrderEdited.productsDetailList = [];
      vm.typeDocumentList = [];

      vm.editSaleOrder = editSaleOrder;
      vm.createCustomer = createCustomer;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;
      vm.searchCustomer = searchCustomer;
      vm.searchWarehouse = searchWarehouse;
      vm.setMaxQuantity = setMaxQuantity;

      vm.saleOrderEdited.warehouseDup = 0;

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;

      vm.loadProduct = loadProduct;

      function init () {
        loadTypeSaleOrder();
        loadCustomer();
        loadWarehouse();

        vm.saleOrderEdited.user = vm.userConected;
        vm.saleOrderEdited.productsDetailList = [];
      }
      init();

      function createCustomer () {
        angular.element('#modalCreateCustomer').modal({backdrop: 'static', keyboard: false});
      }

      function setMaxQuantity(item){
        vm.saleOrderEdited.maxQuantity = '';
        vm.itemDetail.quantity = '';
        if(item){
          vm.saleOrderEdited.maxQuantity = (item.maximum)?item.maximum:'';
        }
      }

      function saleOrderToEdit(){
        if(vm.selectedSaleOrder){
          rDocument.query({id:vm.selectedSaleOrder.id}, function(result){
            vm.saleOrderEdited  = result;

            vm.saleOrderEdited.status = (vm.saleOrderEdited.status == 1)?true:false;

            if(vm.selectedSaleOrder.Document_Detail.CustomerId != null){
              rCustomer.query({id: vm.selectedSaleOrder.Document_Detail.CustomerId}, function(result){
                vm.saleOrderEdited.customerDup = result;
              })
            }
            // else{
            //   vm.saleOrderEdited.customerDup = null;
            // }
            angular.forEach(vm.typeSaleOrderList, function(type){
              if(type.id == vm.selectedSaleOrder.Document_Detail.typeSaleOrder){
                vm.saleOrderEdited.typeSaleOrderDup = type;
              }
            });

            rWarehouse.query({id:vm.selectedSaleOrder.WarehouseId}, function(res){
              vm.saleOrderEdited.warehouseDup = res;
              loadProduct(vm.saleOrderEdited.WarehouseId);
            });

            vm.nextNumberDocument = vm.saleOrderEdited.code;
            vm.saleOrderEdited.comment = vm.saleOrderEdited.comment;
            vm.dateUI = moment(vm.saleOrderEdited.date, DATE_ISO_FORMAT).toDate();

            vm.saleOrderEdited.productsDetailList = [];
            angular.forEach(vm.saleOrderEdited.Products, function(item){
              var obj = {};

              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.saleOrderEdited.warehouseId = item.Document_Product_List.WarehouseId;
              vm.saleOrderEdited.productsDetailList.push(obj);

            });

            rTypeDocument.query({id: vm.saleOrderEdited})

          });
        }
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
      vm.query = {warehouseId: pWarehouseId};
      rSaleOrder.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

    function searchProduct(filter){
      if(vm.saleOrderEdited.warehouseDup != undefined){
        if(filter.search == ''){
          loadProduct(vm.saleOrderEdited.warehouseDup.id);
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.saleOrderEdited.warehouseDup.id };
          rSaleOrder.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

    function cleanFormDetail() {
      vm.detailSelectedIndex = -1;
      vm.itemDetail = { amount: 0 };
      vm.saleOrderEdited.maxQuantity = '';
    }

    function editDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.saleOrderEdited.productsDetailList[vm.detailSelectedIndex];

      detail.product = vm.detailSelectedIndex.product;
      detail.quantity = vm.detailSelectedIndex.quantity;

      // loadProduct();
      angular.forEach(vm.productList, function(item){
        if(vm.detailSelectedIndex.product.id == item.ProductId){
          detail.product = item;
        }
      })

      // Set maxQuantity
      vm.saleOrderEdited.maxQuantity = 0;
      angular.forEach(vm.saleOrderEdited.Products, function(item){
        if(item.Document_Product_List.ProductId == detail.product.ProductId){
          vm.saleOrderEdited.maxQuantity = item.Document_Product_List.quantity + parseInt(detail.product.maximum);
        }
      });

      if(vm.saleOrderEdited.maxQuantity == 0)
        vm.saleOrderEdited.maxQuantity = parseInt(detail.product.maximum);


      vm.detailSelectedIndex = index;
      angular.copy(detail, vm.itemDetail);
    }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        detailToAdd.maximum = 0;
        angular.forEach(vm.saleOrderEdited.Products, function(item){
          if(item.Document_Product_List.ProductId == vm.itemDetail.product.ProductId){
            detailToAdd.maximum = item.Document_Product_List.quantity + parseInt(vm.itemDetail.product.maximum);
          }
        });

        if(detailToAdd.maximum == 0)
          detailToAdd.maximum = parseInt(vm.itemDetail.product.maximum);

        if(detailToAdd.maximum < vm.itemDetail.quantity){
          toastr.error('La cantidad máxima que puede solicitar es de '+detailToAdd.maximum);
          return;
        }

        if (vm.itemDetail.product && vm.itemDetail.quantity){
          detailToAdd.quantity = vm.itemDetail.quantity;
          detailToAdd.product = vm.itemDetail.product.Product;


          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(detailToAdd,vm.saleOrderEdited.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.saleOrderEdited.productsDetailList.push(detailToAdd);
              vm.saleOrderEdited.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.saleOrderEdited.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(detailToAdd.maximum < newQuantity){
                    toastr.error('La cantidad máxima que puede solicitar es de '+detailToAdd.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.saleOrderEdited.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.saleOrderEdited.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.saleOrderEdited.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.saleOrderEdited.maxQuantity = '';
        }

        vm.detailSelectedIndex = -1;
        vm.itemDetail = { amount: 0 };
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
              if(vm.saleOrderEdited.productsDetailList.length == 1){
                toastr.error('Traslado debe contener al menos un producto')
              }
              else{
                vm.saleOrderEdited.productsDetailList.splice(index, 1);
              }
            }
          }
        );
      }

      function editSaleOrder(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        vm.saleOrderEdited.ids = [];
        vm.saleOrderEdited.quantitys = [];
        angular.forEach(vm.saleOrderEdited.productsDetailList, function(item){
          vm.saleOrderEdited.ids.push(item.product.id);
          vm.saleOrderEdited.quantitys.push(item.quantity);
        })

        rSaleOrder.update(vm.saleOrderEdited, function(){
          vm.loading = true;
          vm.submitAttempt = false;
          toastr.success('Orden de Venta actualizada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.loading = false;
                vm.saleOrderEdited = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalEditSaleOrder').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al actualizar Orden de Venta');
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
              angular.element('#modalEditSaleOrder').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditSaleOrder').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditSaleOrder').on('shown.bs.modal', function(){
        saleOrderToEdit();
      });


      angular.element('#modalEditSaleOrder').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.saleOrderEdited = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
