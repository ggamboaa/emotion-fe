(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditTransfer', utnModalEditTransfer);

  /* @ngInject */
  function utnModalEditTransfer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/transfer/modal-edit/modal-edit-transfer.html',
      controller: ModalEditTransferController,
      controllerAs: 'mEditTransfer',
      bindToController: true,
      scope:{
        selectedTransfer: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditTransferController(rTransfer, rSaleOrder, rProduct, rWarehouse, SweetAlert, $rootScope, toastr, utilsService,
     rTypeDocument, authenticationService, moment, rDocument, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;
      vm.transferEdited = {status:true};
      // vm.dateUI = new Date();
      vm.detailSelectedIndex = -1;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      vm.productList = [];
      vm.transferEdited.productsDetailList = [];

      vm.editTransfer = editTransfer;
      vm.dismissModal = dismissModal;

      vm.searchWarehouse = searchWarehouse;
      vm.searchProduct = searchProduct;
      vm.changeWarehouseOrigin = changeWarehouseOrigin;
      vm.setMaxQuantity = setMaxQuantity;


      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;


      function init () {
        loadWarehouse();
        // typeDocument();
        changeWarehouseOrigin();

        // vm.transferEdited.status = true;
        vm.selectedActive = false;
        vm.transferEdited.user = vm.userConected.user;
        vm.transferEdited.productsDetailList = [];
      }
      init();

      function setMaxQuantity(item){
        vm.transferEdited.maxQuantity = (item.maximum)?item.maximum:'';
      }

      function transferToEdit(){
        if(vm.selectedTransfer){
          rDocument.query({id:vm.selectedTransfer.id}, function(result){
            vm.transferEdited  = result;

            vm.dateUI = moment(vm.transferEdited.date, DATE_ISO_FORMAT).toDate();

            rTypeDocument.query({id:vm.transferEdited.TypeDocumentId}, function(type){
              vm.typeDocumentDup = type;
            });

            rWarehouse.query({id:vm.selectedTransfer.Document_Detail.WarehouseOrigin}, function(res){
              vm.transferEdited.warehouseOrigin = res;
              loadProduct(vm.transferEdited.WarehouseId);
            });

            rWarehouse.query({id:vm.selectedTransfer.Document_Detail.WarehouseDestination}, function(res){
              vm.transferEdited.warehouseDestination = res;
              // loadProduct(vm.transferEdited.WarehouseId);
            });

            //PENDIENTE CREAR WAREHOUSE DESTINATION

            // vm.transferEdited.status = (vm.saleOrderEdited.status == 1)?true:false;



            vm.nextNumberDocument = vm.transferEdited.code;
            vm.transferEdited.comment = vm.transferEdited.comment;


            vm.transferEdited.productsDetailList = [];
            angular.forEach(vm.transferEdited.Products, function(item){
              var obj = {};

              vm.warehouseMoment = item.Document_Product_List.WarehouseId;

              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.transferEdited.warehouseId = item.Document_Product_List.WarehouseId;
              vm.transferEdited.productsDetailList.push(obj);
              //vm.transferEdited.oldIds.push(item.id);
            });

            // rTypeDocument.query({id: vm.transferEdited})



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
          vm.transferEdited.maxQuantity = '';
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
      if(vm.transferEdited.warehouseOrigin != undefined){
        if(filter.search == ''){
          loadProduct(vm.transferEdited.warehouseOrigin.id);
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.transferEdited.warehouseOrigin.id };
          rTransfer.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

    function cleanFormDetail() {
      vm.detailSelectedIndex = -1;
      vm.itemDetail = { amount: 0 };
      vm.transferEdited.maxQuantity = '';
    }

    function editDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.transferEdited.productsDetailList[vm.detailSelectedIndex];

      detail.quantity = vm.detailSelectedIndex.quantity;

      // loadProduct();
      angular.forEach(vm.productList, function(item){
        if(vm.detailSelectedIndex.product.id == item.ProductId){
          detail.product = item;
          // vm.transferEdited.maxQuantity = parseInt(item.maximum) + parseInt(vm.detailSelectedIndex.quantity);
        }
      })

      // Set maxQuantity
      vm.transferEdited.maxQuantity = 0;
      angular.forEach(vm.transferEdited.Products, function(item){
        if(item.Document_Product_List.ProductId == detail.product.ProductId){
          vm.transferEdited.maxQuantity = item.Document_Product_List.quantity + parseInt(detail.product.maximum);
        }
      });

      if(vm.transferEdited.maxQuantity == 0)
        vm.transferEdited.maxQuantity = parseInt(detail.product.maximum);

        // vm.transferEdited.maxQuantity = parseInt(detail.product.maximum);


      vm.detailSelectedIndex = index;
      angular.copy(detail, vm.itemDetail);
    }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        detailToAdd.maximum = 0;
        angular.forEach(vm.transferEdited.Products, function(item){
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
          // angular.copy(vm.itemDetail, detailToAdd);
          detailToAdd.quantity = vm.itemDetail.quantity;
          detailToAdd.product = vm.itemDetail.product.Product;


          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(detailToAdd,vm.transferEdited.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.transferEdited.productsDetailList.push(detailToAdd);
              vm.transferEdited.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.transferEdited.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(detailToAdd.maximum < newQuantity){
                    toastr.error('La cantidad máxima que puede solicitar es de '+detailToAdd.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.transferEdited.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.transferEdited.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.transferEdited.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.transferEdited.maxQuantity = '';
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
              // vm.transferEdited.productsDetailList.splice(index, 1);
              if(vm.transferEdited.productsDetailList.length == 1){
                toastr.error('Traslado debe contener al menos un producto')
              }
              else{
                vm.transferEdited.productsDetailList.splice(index, 1);
              }
            }
          }
        );
      }

      function editTransfer(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.transferEdited.productsDetailList.length < 1 && vm.typeDocumentDup.id == 9){
          toastr.error('Traslado debe contener al menos un Producto asociado');
          vm.loading = false;
          return;
        }

        vm.transferEdited.ids = [];
        vm.transferEdited.quantitys = [];
        angular.forEach(vm.transferEdited.productsDetailList, function(item){
          vm.transferEdited.ids.push(item.product.id);
          vm.transferEdited.quantitys.push(item.quantity);
        })

        rSaleOrder.update(vm.transferEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.transferEdited = {};
          toastr.success('Traslado actualizado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.transferEdited = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalEditTransfer').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Traslado');
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
              angular.element('#modalEditTransfer').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditTransfer').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditTransfer').on('shown.bs.modal', function(){
        transferToEdit();
      });

      angular.element('#modalEditTransfer').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.transferEdited = {};
        init();
      });

    }
  }
})();
