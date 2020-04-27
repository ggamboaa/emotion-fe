(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateTransfer', utnModalCreateTransfer);

  /* @ngInject */
  function utnModalCreateTransfer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/transfer/modal-create/modal-create-transfer.html',
      controller: ModalCreateTransferController,
      controllerAs: 'mCreateTransfer',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateTransferController(rTransfer, rProduct, rWarehouse, SweetAlert, $rootScope, toastr, utilsService,
     rTypeDocument, authenticationService, moment) {
      var vm = this;
      vm.status = true;
      vm.newTransfer = {status:true};
      vm.dateUI = new Date();
      vm.detailSelectedIndex = -1;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      vm.productList = [];
      vm.newTransfer.productsDetailList = [];

      vm.createTransfer = createTransfer;
      vm.dismissModal = dismissModal;
      vm.setMaxQuantity = setMaxQuantity;

      vm.searchWarehouse = searchWarehouse;
      vm.searchProduct = searchProduct;
      vm.changeWarehouseOrigin = changeWarehouseOrigin;


      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;


      function init () {
        loadWarehouse();
        typeDocument();
        changeWarehouseOrigin();

        vm.newTransfer.status = true;
        vm.selectedActive = false;
        vm.newTransfer.user = vm.userConected.user;
        vm.newTransfer.warehouseOrigin = vm.userConected.warehouseSelected;
        vm.newTransfer.productsDetailList = [];
      }
      init();

      function setMaxQuantity(item){
        vm.itemDetail.quantity = '';
        vm.newTransfer.maxQuantity = '';
        if(item != null){
          vm.newTransfer.maxQuantity = item.maximum;
        }
      }

      function changeWarehouseOrigin(pId){
        if(pId >= 0){
          loadProduct(pId);
        }
        else{
          vm.productList = [];
          vm.itemDetail = {};
          vm.newTransfer.maxQuantity = '';
        }
      }

      function typeDocument(){
        rTypeDocument.query({id: 9}, function(result){
          vm.typeDocumentDup = result;
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

    function loadProduct(pWarehouseId){
      vm.query = {warehouseId: pWarehouseId};
      rTransfer.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

    function searchProduct(filter){
      if(vm.newTransfer.warehouseOrigin != undefined){
        if(filter.search == ''){
          loadProduct(vm.newTransfer.warehouseOrigin.id);
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.newTransfer.warehouseOrigin.id };
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

    function editDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.newTransfer.productsDetailList[vm.detailSelectedIndex];

      detail.quantity = vm.detailSelectedIndex.quantity;
      vm.newTransfer.maxQuantity = vm.detailSelectedIndex.maximum;

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
          toastr.error('La cantidad máxima que puede solicitar es de '+vm.itemDetail.product.maximum);
          //vm.newTransfer.maxQuantity = '';
          return;
        }

        if (vm.itemDetail.product && vm.itemDetail.quantity){
          // angular.copy(vm.itemDetail, detailToAdd);
          detailToAdd.quantity = vm.itemDetail.quantity;
          detailToAdd.product = vm.itemDetail.product.Product;
          detailToAdd.maximum = vm.itemDetail.product.maximum;

          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(detailToAdd,vm.newTransfer.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.newTransfer.productsDetailList.push(detailToAdd);
              vm.newTransfer.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.newTransfer.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(parseInt(vm.itemDetail.product.maximum) < newQuantity){
                    vm.newTransfer.maxQuantity = '';
                    toastr.error('La cantidad máxima que puede solicitar es de '+vm.itemDetail.product.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.newTransfer.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.newTransfer.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.newTransfer.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.newTransfer.maxQuantity = '';
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
              vm.newTransfer.productsDetailList.splice(index, 1);
            }
          }
        );
      }

      function createTransfer(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newTransfer.productsDetailList.length < 1 && vm.typeDocumentDup.id == 9){
          toastr.error('Traslado debe contener al menos un Producto asociado');
          vm.loading = false;
          return;
        }

        if(vm.newTransfer.warehouseOrigin.id == vm.newTransfer.warehouseDestination.id){
          toastr.error('Los Traslados deben de realizarce entre diferentes bodegas');
          vm.loading = false;
          return;
        }

        vm.newTransfer.ids = [];
        vm.newTransfer.quantitys = [];
        angular.forEach(vm.newTransfer.productsDetailList, function(item){
          vm.newTransfer.ids.push(item.product.id);
          vm.newTransfer.quantitys.push(item.quantity);
        })

        vm.newTransfer.TypeDocumentId = 9;

        if(vm.dateUI){
          vm.newTransfer.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }

        vm.newTransfer.WarehouseId = vm.newTransfer.warehouseOrigin.id;

        rTransfer.save(vm.newTransfer, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.newTransfer = {};
          toastr.success('Traslado registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newTransfer = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateTransfer').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Traslado');
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
              angular.element('#modalCreateTransfer').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateTransfer').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateTransfer').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newTransfer = {};
        init();
      });

    }
  }
})();
