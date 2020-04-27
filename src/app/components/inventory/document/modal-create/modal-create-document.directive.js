(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateDocument', utnModalCreateDocument);

  /* @ngInject */
  function utnModalCreateDocument() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/document/modal-create/modal-create-document.html',
      controller: ModalCreateDocumentController,
      controllerAs: 'mCreateDocument',
      bindToController: true,
      scope:{
        selectedItem: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalCreateDocumentController(rDocument, rTypeDocument, rProduct, SweetAlert, $rootScope, toastr, authenticationService, moment, utilsService) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      
      vm.dateUI = new Date()
      vm.detailSelectedIndex = -1;

      vm.newDocument = {status:true};
      vm.newDocument.productsDetailList = [];
      vm.typeDocumentList = [];

      vm.createDocument = createDocument;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;
      
      function init () {
        
        vm.showMe = true;
        vm.newDocument.typeDocumentDup = vm.typeDocumentList[3];
        if(!vm.selectedItem.showMe){
          vm.showMe = false;
          vm.newDocument.typeDocumentDup = vm.typeDocumentList[5];
        }

        loadTypeDocument();
        loadProduct();

        vm.warehouse = userInfo[0].warehouseSelected;
        vm.newDocument.status = true;
        vm.newDocument.user = vm.userConected.user;
        vm.newDocument.productsDetailList = [];
      }
      init();

      function loadTypeDocument(){
        rTypeDocument.query(function(result){
          vm.typeDocumentList  = result.records;
        });
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

      function cleanFormDetail() {
        vm.detailSelectedIndex = -1;
        vm.itemDetail = { amount: 0 };
      }

      function editDetail(index) {
        vm.detailSelectedIndex = index;
        vm.itemDetail = {};

        angular.copy(vm.newDocument.productsDetailList[vm.detailSelectedIndex], vm.itemDetail);
      }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if (vm.itemDetail.product && vm.itemDetail.quantity){
          angular.copy(vm.itemDetail, detailToAdd);

          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(vm.itemDetail,vm.newDocument.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.newDocument.productsDetailList.push(detailToAdd);
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.newDocument.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  item.quantity += parseInt(detailToAdd.quantity);
                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.newDocument.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
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
              vm.newDocument.productsDetailList.splice(index, 1);
            }
          }
        );
      }

      function createDocument(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newDocument.productsDetailList.length == 0 && 
          (vm.newDocument.TypeDocumentId == 6 || vm.newDocument.TypeDocumentId == 4)){
          if(vm.showMe){
            toastr.error('El Documento debe contener al menos un Producto asociado');
          }else{
            toastr.error('La Devolución debe contener al menos un Producto asociado');
          }
          vm.loading = false;
          return;
        }

        vm.newDocument.ids = [];
        vm.newDocument.quantitys = [];
        angular.forEach(vm.newDocument.productsDetailList, function(item){
          vm.newDocument.ids.push(item.product.id);
          vm.newDocument.quantitys.push(item.quantity);
        })

        if(vm.dateUI){
          vm.newDocument.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }

        if(vm.newDocument.typeDocumentDup){
          vm.newDocument.TypeDocumentId = vm.newDocument.typeDocumentDup.id;
        }

        if(vm.warehouse){
          vm.newDocument.WarehouseId = vm.warehouse.id;
        }

        rDocument.save(vm.newDocument, function(){
          vm.loading = true;
          vm.submitAttempt = false;
          if(vm.showMe){
            toastr.success('Recibo registrado satisfactoriamente', {
              onShown: function(){
                if(isNewRequired){
                  vm.loading = false;
                  vm.newDocument = {status:true};
                  form.$setPristine();
                }else{
                  angular.element('#modalCreateDocument').modal('hide');
                }
                $rootScope.$broadcast('documentEdited');
              }
            });
          }else{
            toastr.success('Devolución registrada satisfactoriamente', {
              onShown: function(){
                if(isNewRequired){
                  vm.loading = false;
                  vm.newDocument = {status:true};
                  form.$setPristine();
                }else{
                  angular.element('#modalCreateDocument').modal('hide');
                }
                $rootScope.$broadcast('returnEdited');
              }
            });
          }
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
          if(vm.showMe){
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Recibo');
          }else{
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Devolución');
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
              angular.element('#modalCreateDocument').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateDocument').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateDocument').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newDocument = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
