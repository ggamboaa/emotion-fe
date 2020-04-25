(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditRequisition', utnModalEditRequisition);

  /* @ngInject */
  function utnModalEditRequisition() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/requisition/modal-edit/modal-edit-requisition.html',
      controller: ModalEditRequisitionController,
      controllerAs: 'mEditRequisition',
      bindToController: true,
      scope:{
        selectedItem: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditRequisitionController(rSaleOrder, rTransfer, rDocument, rTypeDocument, rProduct, SweetAlert, $rootScope,
     toastr, authenticationService, moment, utilsService, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;

      vm.dateUI = new Date()

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.dateUI = new Date()
      vm.detailSelectedIndex = -1;

      vm.requisitionEdited = {status:true};
      vm.requisitionEdited.productsDetailList = [];
      vm.typeRequisitionList = [];

      vm.editRequisition = editRequisition;
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
        vm.requisitionEdited.status = true;
        vm.requisitionEdited.user = vm.userConected.user;
        vm.requisitionEdited.productsDetailList = [];
      }
      init();

      function requisitionToEdit(){
        if(vm.selectedItem){
          rDocument.query({id:vm.selectedItem.id}, function(result){
            vm.requisitionEdited  = result;

            vm.dateUI = moment(vm.requisitionEdited.date, DATE_ISO_FORMAT).toDate();

            vm.typeDocumentDup = vm.selectedItem.Type_Document;

            vm.requisitionEdited.status = (vm.requisitionEdited.status == 1)?true:false;

            vm.nextNumberDocument = vm.requisitionEdited.code;
            vm.requisitionEdited.comment = vm.requisitionEdited.comment;


            vm.requisitionEdited.productsDetailList = [];
            angular.forEach(vm.requisitionEdited.Products, function(item){
              var obj = {};

              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.requisitionEdited.productsDetailList.push(obj);
              vm.requisitionEdited.warehouseId = item.Document_Product_List.WarehouseId;
              //vm.requisitionEdited.oldIds.push(item.id);
            });

            // rTypeDocument.query({id: vm.requisitionEdited})



          });
        }
      }

      function setMaxQuantity(item){
        vm.requisitionEdited.maxQuantity = (item.maximum)?item.maximum:'';
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
      vm.requisitionEdited.maxQuantity = '';
    }

    function editDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.requisitionEdited.productsDetailList[vm.detailSelectedIndex];

      detail.quantity = vm.detailSelectedIndex.quantity;

      // loadProduct();
      angular.forEach(vm.productList, function(item){
        if(vm.detailSelectedIndex.product.id == item.ProductId){
          detail.product = item;
          // vm.requisitionEdited.maxQuantity = parseInt(item.maximum) + parseInt(vm.detailSelectedIndex.quantity);
        }
      })

      // Set maxQuantity
      vm.requisitionEdited.maxQuantity = 0;
      angular.forEach(vm.requisitionEdited.Products, function(item){
        if(item.Document_Product_List.ProductId == detail.product.ProductId){
          vm.requisitionEdited.maxQuantity = item.Document_Product_List.quantity + parseInt(detail.product.maximum);
        }
      });

      if(vm.requisitionEdited.maxQuantity == 0)
        vm.requisitionEdited.maxQuantity = parseInt(detail.product.maximum);

        // vm.requisitionEdited.maxQuantity = parseInt(detail.product.maximum);


      vm.detailSelectedIndex = index;
      angular.copy(detail, vm.itemDetail);
    }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        detailToAdd.maximum = 0;
        angular.forEach(vm.requisitionEdited.Products, function(item){
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
            if (!utilsService.validateDuplicateList(detailToAdd,vm.requisitionEdited.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.requisitionEdited.productsDetailList.push(detailToAdd);
              vm.requisitionEdited.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.requisitionEdited.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(detailToAdd.maximum < newQuantity){
                    toastr.error('La cantidad máxima que puede solicitar es de '+detailToAdd.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.requisitionEdited.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.requisitionEdited.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.requisitionEdited.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.requisitionEdited.maxQuantity = '';
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
              // vm.requisitionEdited.productsDetailList.splice(index, 1);
              if(vm.requisitionEdited.productsDetailList.length == 1){
                toastr.error('Traslado debe contener al menos un producto')
              }
              else{
                vm.requisitionEdited.productsDetailList.splice(index, 1);
              }
            }
          }
        );
      }



      function editRequisition(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.requisitionEdited.productsDetailList.length < 1 && vm.typeDocumentDup.id == 9){
          toastr.error('Requisición debe contener al menos un Producto asociado');
          vm.loading = false;
          return;
        }

        vm.requisitionEdited.ids = [];
        vm.requisitionEdited.quantitys = [];
        angular.forEach(vm.requisitionEdited.productsDetailList, function(item){
          vm.requisitionEdited.ids.push(item.product.id);
          vm.requisitionEdited.quantitys.push(item.quantity);
        })

        rSaleOrder.update(vm.requisitionEdited, function(){
          vm.loading = true;
          vm.submitAttempt = false;
            toastr.success('Requisición registrada satisfactoriamente', {
              onShown: function(){
                if(isNewRequired){
                  vm.loading = false;
                  vm.requisitionEdited = {status:true};
                  form.$setPristine();
                }else{
                  angular.element('#modalEditRequisition').modal('hide');
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
              angular.element('#modalEditRequisition').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditRequisition').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditRequisition').on('shown.bs.modal', function(){
        requisitionToEdit();
      });

      angular.element('#modalEditRequisition').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.requisitionEdited = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
