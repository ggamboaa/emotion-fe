(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditDocument', utnModalEditDocument);

  /* @ngInject */
  function utnModalEditDocument() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/document/modal-edit/modal-edit-document.html',
      controller: ModalEditDocumentController,
      controllerAs: 'mEditDocument',
      bindToController: true,
      scope:{
        selectedItem: '='
      }

    };

    return directive;

    /** @ngInject */
    function ModalEditDocumentController(rDocument, rProduct, rTypeDocument, SweetAlert, $rootScope, toastr, authenticationService, moment, DATE_ISO_FORMAT, utilsService) {
      var vm = this;
      vm.status = true;
      vm.documentEdited = {status:true};

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.dateUI = new Date();
      vm.documentEdited = {};
      vm.documentEdited.productsDetailList = [];

      vm.editDocument = editDocument;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;
      vm.detailSelectedIndex = -1;

      function init () {
        vm.documentEdited.status = true;
        loadProduct();
        loadTypeDocument();
      }
      init();

      function documentToEdit(){
        if(vm.selectedItem){

          vm.showMe = false;
          if(vm.selectedItem.showMe){
            vm.showMe = true;
          }

          rDocument.query({id:vm.selectedItem.id}, function(result){
            vm.documentEdited  = result;

            vm.documentEdited.status = (vm.documentEdited.status == 1)?true:false;

            vm.warehouse = {};
            vm.warehouse.name = vm.selectedItem.warehouseName;

            vm.documentEdited.productsDetailList = [];

            vm.dateUI = moment(vm.documentEdited.date, DATE_ISO_FORMAT).toDate();

            // if(vm.documentEdited.TypeDocumentId){
            //   var action = parseInt(vm.documentEdited.TypeDocumentId);
            //   switch (action) {
            //     case 1:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[0];
            //       break;
            //     case 2:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[1];
            //       break;
            //     case 3:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[2];
            //       break;
            //     case 4:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[3];
            //       break;
            //     case 5:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[4];
            //       break;
            //     case 6:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[5];
            //       break;
            //     case 7:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[6];
            //       break;
            //     case 8:
            //       vm.documentEdited.typeDocumentDup = vm.typeDocumentList[7];
            //       break;
            //   }
            // }

            angular.forEach(vm.documentEdited.Products, function(item){
              var obj = {};
              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.documentEdited.warehouseId = item.Document_Product_List.WarehouseId;
              vm.documentEdited.productsDetailList.push(obj);
            });
          });
        }
      }

      function loadTypeDocument(){
        vm.query = {direction:'ASC'};
        rTypeDocument.query(vm.query, function(result){
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
        vm.addAttempt = false;
        vm.detailSelectedIndex = -1;
        vm.itemDetail = { amount: 0 };
      }

      function editDetail(index) {
        vm.detailSelectedIndex = index;
        vm.itemDetail = {};

        angular.copy(vm.documentEdited.productsDetailList[vm.detailSelectedIndex], vm.itemDetail);
      }


      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if (vm.itemDetail.product && vm.itemDetail.quantity){
          angular.copy(vm.itemDetail, detailToAdd);

          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(vm.itemDetail,vm.documentEdited.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.documentEdited.productsDetailList.push(detailToAdd);
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.documentEdited.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  item.quantity += parseInt(detailToAdd.quantity);
                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.documentEdited.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
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
              vm.documentEdited.productsDetailList.splice(index, 1);
            }
          }
        );
      }

      function editDocument(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.documentEdited.productsDetailList.length == 0 &&
          (vm.documentEdited.TypeDocumentId == 6 || vm.documentEdited.TypeDocumentId == 4)){
          if(vm.showMe){
            toastr.error('El Documento debe contener al menos un Producto asociado');
          }else{
            toastr.error('La Devolución debe contener al menos un Producto asociado');
          }
          vm.loading = false;
          return;
        }

        vm.documentEdited.ids = [];
        vm.documentEdited.quantitys = [];
        angular.forEach(vm.documentEdited.productsDetailList, function(item){
          vm.documentEdited.ids.push(item.product.id);
          vm.documentEdited.quantitys.push(item.quantity);
        })

        rDocument.update(vm.documentEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          if(vm.showMe){
            toastr.success('Recibo actualizado satisfactoriamente', {
              onShown: function(){
                angular.element('#modalEditDocument').modal('hide');
                $rootScope.$broadcast('documentEdited');
              }
            });
          }else{
            toastr.success('Devolución actualizada satisfactoriamente', {
              onShown: function(){
                angular.element('#modalEditDocument').modal('hide');
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
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Recibo');
          }else{
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Devolución');
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
              angular.element('#modalEditDocument').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditDocument').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditDocument').on('shown.bs.modal', function(){
        documentToEdit();
      });

      angular.element('#modalEditDocument').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.itemDetail = {};
        vm.documentEdited = {};
        vm.documentEdited.productsDetailList = [];

        init();
      });
    }
  }
})();
