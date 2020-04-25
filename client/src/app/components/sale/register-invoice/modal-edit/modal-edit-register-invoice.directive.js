(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditRegisterInvoice', utnModalEditRegisterInvoice);

  /* @ngInject */
  function utnModalEditRegisterInvoice() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sale/register-invoice/modal-edit/modal-edit-register-invoice.html',
      controller: ModalEditRegisterInvoiceController,
      controllerAs: 'mEditRegisterInvoice',
      bindToController: true,
      scope:{
        selectedRegisterInvoice: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditRegisterInvoiceController(rCustomer, rSaleOrder, rProduct, rWarehouse, SweetAlert, $rootScope, toastr, utilsService,
     rTypeDocument, authenticationService, moment, rDocument, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;
      vm.registerInvoiceEdited = {status:true};
      // vm.dateUI = new Date();
      vm.detailSelectedIndex = -1;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      vm.productList = [];
      vm.registerInvoiceEdited.productsDetailList = [];

      vm.editRegisterInvoice = editRegisterInvoice;
      vm.dismissModal = dismissModal;


      function init () {

        vm.selectedActive = false;
        vm.registerInvoiceEdited.user = vm.userConected.user;
        vm.registerInvoiceEdited.productsDetailList = [];
      }
      init();

      function registerinvoiceToEdit(){
        if(vm.selectedRegisterInvoice){
          rDocument.query({id:vm.selectedRegisterInvoice.id}, function(result){
            vm.registerInvoiceEdited  = result;

            vm.dateUI = moment(vm.registerInvoiceEdited.date, DATE_ISO_FORMAT).toDate();
            vm.nextNumberDocument = vm.registerInvoiceEdited.code;
            vm.registerInvoiceEdited.comment = vm.registerInvoiceEdited.comment;
            vm.registerInvoiceEdited.productsDetailList = [];

            if(vm.selectedRegisterInvoice.Document_Detail.CustomerId != null){
              rCustomer.query({id: vm.selectedRegisterInvoice.Document_Detail.CustomerId}, function(result){
                vm.registerInvoiceEdited.customerDup = result;
              })
            }

            rTypeDocument.query({id:vm.registerInvoiceEdited.TypeDocumentId}, function(type){
              vm.typeDocumentDup = type;
            });

            angular.forEach(vm.registerInvoiceEdited.Products, function(item){
              vm.warehouseMoment = item.Document_Product_List.WarehouseId;
              var obj = {};
              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.registerInvoiceEdited.warehouseId = item.Document_Product_List.WarehouseId;
              vm.registerInvoiceEdited.productsDetailList.push(obj);
            });

          });
        }
      }

      function editRegisterInvoice(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        rSaleOrder.registerInvoice(vm.registerInvoiceEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.registerInvoiceEdited = {};
          toastr.success('Factura registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.registerInvoiceEdited = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalEditRegisterInvoice').modal('hide');
              }
              $rootScope.$broadcast('registerInvoiceEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al registrar Factura');
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
              angular.element('#modalEditRegisterInvoice').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditRegisterInvoice').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditRegisterInvoice').on('shown.bs.modal', function(){
        registerinvoiceToEdit();
      });

      angular.element('#modalEditRegisterInvoice').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.registerInvoiceEdited = {};
        init();
      });

    }
  }
})();
