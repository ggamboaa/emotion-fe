(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalSendTransfer', utnModalSendTransfer);

  /* @ngInject */
  function utnModalSendTransfer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/transfer/modal-send/modal-send-transfer.html',
      controller: ModalSendTransferController,
      controllerAs: 'mSendTransfer',
      bindToController: true,
      scope:{
        selectedTransfer: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalSendTransferController(rTransfer, rSaleOrder, rProduct, rWarehouse, SweetAlert, $rootScope, toastr, utilsService,
     rTypeDocument, authenticationService, moment, rDocument, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;
      vm.transferSended = {status:true};
      // vm.dateUI = new Date();
      vm.detailSelectedIndex = -1;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      vm.productList = [];
      vm.transferSended.productsDetailList = [];

      vm.sendTransfer = sendTransfer;
      vm.dismissModal = dismissModal;




      function init () {
        loadWarehouse();

        vm.selectedActive = false;
        vm.transferSended.user = vm.userConected.user;
        vm.transferSended.productsDetailList = [];
      }
      init();

      function transferToSend(){
        if(vm.selectedTransfer){
          rDocument.query({id:vm.selectedTransfer.id}, function(result){
            vm.transferSended  = result;
            vm.transferSended.transfer = vm.selectedTransfer;

            vm.dateUI = moment(vm.transferSended.date, DATE_ISO_FORMAT).toDate();

            rTypeDocument.query({id:vm.transferSended.TypeDocumentId}, function(type){
              vm.typeDocumentDup = type;
            });

            rWarehouse.query({id:vm.selectedTransfer.Document_Detail.WarehouseOrigin}, function(res){
              vm.transferSended.warehouseOrigin = res;
              loadProduct(vm.transferSended.WarehouseId);
            });

            rWarehouse.query({id:vm.selectedTransfer.Document_Detail.WarehouseDestination}, function(res){
              vm.transferSended.warehouseDestination = res;
            });


            vm.nextNumberDocument = vm.transferSended.code;
            vm.transferSended.comment = vm.transferSended.comment;


            vm.transferSended.productsDetailList = [];
            angular.forEach(vm.transferSended.Products, function(item){
              var obj = {};

              vm.warehouseMoment = item.Document_Product_List.WarehouseId;

              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.transferSended.warehouseId = item.Document_Product_List.WarehouseId;
              vm.transferSended.productsDetailList.push(obj);
              //vm.transferSended.oldIds.push(item.id);
            });

            // rTypeDocument.query({id: vm.transferSended})



          });
        }
      }
      function loadProduct(pWarehouseId){
      vm.query = {warehouseId: pWarehouseId};
      rTransfer.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

      function loadWarehouse(){
        rWarehouse.query(function(result){
          vm.warehouseList  = result.records;
        });
      }

      function sendTransfer(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.transferSended.productsDetailList.length < 1 && vm.typeDocumentDup.id == 9){
          toastr.error('Traslado debe contener al menos un Producto asociado');
          vm.loading = false;
          return;
        }

        // vm.transferSended.ids = [];
        // vm.transferSended.quantitys = [];
        // angular.forEach(vm.transferSended.productsDetailList, function(item){
        //   vm.transferSended.ids.push(item.product.id);
        //   vm.transferSended.quantitys.push(item.quantity);
        // })

        // vm.transferSended.TypeDocumentId = 9;

        // if(vm.dateUI){
        //   vm.transferSended.date = moment(vm.dateUI).format('YYYY-MM-DD');
        // }

        // vm.transferSended.WarehouseId = vm.transferSended.warehouseOrigin.id;

        // vm.transferSended.ids = [];
        // vm.transferSended.quantitys = [];
        // angular.forEach(vm.transferSended.productsDetailList, function(item){
        //   vm.transferSended.ids.push(item.product.id);
        //   vm.transferSended.quantitys.push(item.quantity);
        // })

        rTransfer.sendProducts(vm.transferSended, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.transferSended = {};
          toastr.success('Traslado enviado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.transferSended = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalSendTransfer').modal('hide');
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
              angular.element('#modalSendTransfer').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalSendTransfer').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalSendTransfer').on('shown.bs.modal', function(){
        transferToSend();
      });

      angular.element('#modalSendTransfer').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.transferSended = {};
        init();
      });

    }
  }
})();
