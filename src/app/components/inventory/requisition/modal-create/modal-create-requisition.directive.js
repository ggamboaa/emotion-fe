(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateRequisition', utnModalCreateRequisition);

  /* @ngInject */
  function utnModalCreateRequisition() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/requisition/modal-create/modal-create-requisition.html',
      controller: ModalCreateRequisitionController,
      controllerAs: 'mCreateRequisition',
      bindToController: true,
      scope:{
        selectedItem: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalCreateRequisitionController(rSaleOrder, rTransfer, rDocument, rTypeDocument, rProduct, SweetAlert, $rootScope, toastr, authenticationService, moment, utilsService) {
      var vm = this;
      vm.status = true;

      vm.dateUI = new Date()

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.dateUI = new Date()
      vm.detailSelectedIndex = -1;

      vm.newRequisition = {status:true};
      vm.newRequisition.productsDetailList = [];
      vm.typeRequisitionList = [];

      vm.createRequisition = createRequisition;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;
      vm.setMaxQuantity = setMaxQuantity;

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;

      function init () {

        loadTypeDocument();
        loadProduct();

        vm.warehouse = userInfo[0].warehouseSelected;
        vm.newRequisition.status = true;
        vm.newRequisition.user = vm.userConected.user;
        vm.newRequisition.productsDetailList = [];
      }
      init();

      function setMaxQuantity(item){
        vm.newRequisition.maxQuantity = (item.maximum)?item.maximum:'';
      }


      function loadTypeDocument(){
        rTypeDocument.query({id: 7},function(result){
          vm.typeDocumentDup = result;
        });
      }

      function loadProduct(){
      vm.query = {warehouseId: vm.userConected.warehouseSelected.id};
      rTransfer.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

    function searchProduct(filter){
      if(vm.typeDocumentDup != undefined){
        if(filter.search == ''){
          loadProduct();
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.userConected.warehouseSelected.id };
          rTransfer.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

    function cleanFormDetail() {
      vm.detailSelectedIndex = -1;
      vm.itemDetail = { amount: 0 };
      vm.newRequisition.maxQuantity = '';
    }

    function editDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.newRequisition.productsDetailList[vm.detailSelectedIndex];

      detail.quantity = vm.detailSelectedIndex.quantity;
      vm.newRequisition.maxQuantity = vm.detailSelectedIndex.maximum;

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
          vm.newRequisition.maxQuantity = '';
          return;
        }

        if (vm.itemDetail.product && vm.itemDetail.quantity){
          // angular.copy(vm.itemDetail, detailToAdd);
          detailToAdd.quantity = vm.itemDetail.quantity;
          detailToAdd.product = vm.itemDetail.product.Product;
          detailToAdd.maximum = vm.itemDetail.product.maximum;

          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(detailToAdd,vm.newRequisition.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.newRequisition.productsDetailList.push(detailToAdd);
              vm.newRequisition.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.newRequisition.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(parseInt(vm.itemDetail.product.maximum) < newQuantity){
                    vm.newRequisition.maxQuantity = '';
                    toastr.error('La cantidad máxima que puede solicitar es de '+vm.itemDetail.product.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.newRequisition.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.newRequisition.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.newRequisition.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.newRequisition.maxQuantity = '';
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
              vm.newRequisition.productsDetailList.splice(index, 1);
            }
          }
        );
      }

      function createRequisition(form,isNewRequired){
  vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newRequisition.productsDetailList.length < 1 && vm.typeDocumentDup.id == 9){
          toastr.error('Requisición debe contener al menos un Producto asociado');
          vm.loading = false;
          return;
        }

        vm.newRequisition.ids = [];
        vm.newRequisition.quantitys = [];
        angular.forEach(vm.newRequisition.productsDetailList, function(item){
          vm.newRequisition.ids.push(item.product.id);
          vm.newRequisition.quantitys.push(item.quantity);
        })

        if(vm.dateUI){
          vm.newRequisition.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }

        vm.newRequisition.WarehouseId = vm.warehouse.id;

        vm.newRequisition.TypeDocumentId = 7;

        rSaleOrder.save(vm.newRequisition, function(){
          vm.loading = true;
          vm.submitAttempt = false;
            toastr.success('Requisición registrada satisfactoriamente', {
              onShown: function(){
                if(isNewRequired){
                  vm.loading = false;
                  vm.newRequisition = {status:true};
                  form.$setPristine();
                }else{
                  angular.element('#modalCreateRequisition').modal('hide');
                }
                $rootScope.$broadcast('requisitionEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Requisición');

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
              angular.element('#modalCreateRequisition').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateRequisition').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateRequisition').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newRequisition = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
