(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalReceiptTransfer', utnModalReceiptTransfer);

  /* @ngInject */
  function utnModalReceiptTransfer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/transfer/modal-receipt/modal-receipt-transfer.html',
      controller: ModalReceiptTransferController,
      controllerAs: 'mReceiptTransfer',
      bindToController: true,
      scope:{
        selectedTransfer: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalReceiptTransferController(rTransfer, rSaleOrder, rProduct, rWarehouse, SweetAlert, $rootScope, toastr, utilsService,
     rTypeDocument, authenticationService, moment, rDocument, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;
      vm.transferReceipted = {status:true};
      // vm.dateUI = new Date();
      vm.detailSelectedIndex = -1;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      vm.productList = [];
      vm.transferReceipted.productsDetailList = [];

      vm.receiptTransfer = receiptTransfer;
      vm.dismissModal = dismissModal;

      vm.searchWarehouse = searchWarehouse;
      vm.searchProduct = searchProduct;
      vm.changeWarehouseOrigin = changeWarehouseOrigin;


      vm.receiptDetail = receiptDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;


      function init () {
        loadWarehouse();
        // typeDocument();
        changeWarehouseOrigin();

        // vm.transferReceipted.status = true;
        vm.selectedActive = false;
        vm.transferReceipted.user = vm.userConected.user;
        vm.transferReceipted.productsDetailList = [];
      }
      init();

      function transferToReceipt(){
        if(vm.selectedTransfer){
          rDocument.query({id:vm.selectedTransfer.id}, function(result){
            vm.transferReceipted  = result;

            vm.dateUI = moment(vm.transferReceipted.date, DATE_ISO_FORMAT).toDate();

            rTypeDocument.query({id:vm.transferReceipted.TypeDocumentId}, function(type){
              vm.typeDocumentDup = type;
            });

            rWarehouse.query({id:vm.selectedTransfer.Document_Detail.WarehouseOrigin}, function(res){
              vm.transferReceipted.warehouseOrigin = res;
              loadProduct(vm.transferReceipted.WarehouseId);
            });

            rWarehouse.query({id:vm.selectedTransfer.Document_Detail.WarehouseDestination}, function(res){
              vm.transferReceipted.warehouseDestination = res;
              // loadProduct(vm.transferReceipted.WarehouseId);
            });

            //PENDIENTE CREAR WAREHOUSE DESTINATION

            // vm.transferReceipted.status = (vm.saleOrderReceipted.status == 1)?true:false;

        

            vm.nextNumberDocument = vm.transferReceipted.code;
            vm.transferReceipted.comment = vm.transferReceipted.comment;
           

            vm.transferReceipted.productsDetailList = [];
            angular.forEach(vm.transferReceipted.Products, function(item){
              var obj = {};

              vm.warehouseMoment = item.Document_Product_List.WarehouseId;

              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.transferReceipted.warehouseId = item.Document_Product_List.WarehouseId;
              vm.transferReceipted.productsDetailList.push(obj);
              //vm.transferReceipted.oldIds.push(item.id);
            });

            // rTypeDocument.query({id: vm.transferReceipted})

            

          });
        }
      }

      function changeWarehouseOrigin(pId){
        if(pId >= 0){
          loadProduct(pId);
        }
        else{
          vm.productList = [];
          vm.itemDetail = {};
          vm.transferReceipted.maxQuantity = '';
        }
      }

      // function typeDocument(){
      //   rTypeDocument.query({id: 9}, function(result){
      //     vm.typeDocumentDup = result;
      //   });
      // }

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

    function loadProduct(pWarehouseId){
      vm.query = {warehouseId: pWarehouseId};
      rTransfer.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

    function searchProduct(filter){
      if(vm.transferReceipted.warehouseOrigin != undefined){
        if(filter.search == ''){
          loadProduct(vm.transferReceipted.warehouseOrigin.id);
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.transferReceipted.warehouseOrigin.id };
          rTransfer.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

    function cleanFormDetail() {
      vm.detailSelectedIndex = -1;
      vm.itemDetail = { amount: 0 };
      vm.newTransfer.maxQuantity = '';
    }

    function receiptDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.transferReceipted.productsDetailList[vm.detailSelectedIndex];

      // detail.product = vm.detailSelectedIndex.product;
      detail.quantity = vm.detailSelectedIndex.quantity;

      // loadProduct();
      angular.forEach(vm.productList, function(item){
        if(vm.detailSelectedIndex.product.id == item.ProductId){
          detail.product = item;
          vm.transferReceipted.maxQuantity = item.maximum;
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
            if (!utilsService.validateDuplicateList(detailToAdd,vm.transferReceipted.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.transferReceipted.productsDetailList.push(detailToAdd);
              vm.transferReceipted.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.transferReceipted.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(parseInt(vm.itemDetail.product.maximum) < newQuantity){
                    toastr.error('La cantidad máxima que puede solicitar es de '+vm.itemDetail.product.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.transferReceipted.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.transferReceipted.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.transferReceipted.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.transferReceipted.maxQuantity = '';
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
              vm.transferReceipted.productsDetailList.splice(index, 1);
            }
          }
        );
      }

      function receiptTransfer(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.transferReceipted.productsDetailList.length < 1 && vm.typeDocumentDup.id == 9){
          toastr.error('Traslado debe contener al menos un Producto asociado');
          vm.loading = false;
          return;
        }
        
        rTransfer.receiptProducts(vm.transferReceipted, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.transferReceipted = {};
          toastr.success('Traslado enviado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.transferReceipted = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalReceiptTransfer').modal('hide');
              }
              $rootScope.$broadcast('transferEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al enviar Traslado');
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
              angular.element('#modalReceiptTransfer').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalReceiptTransfer').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalReceiptTransfer').on('shown.bs.modal', function(){
        transferToReceipt();
      });

      angular.element('#modalReceiptTransfer').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.transferReceipted = {};
        init();
      });

    }
  }
})();
