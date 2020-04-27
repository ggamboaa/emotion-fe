(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalImportProduct', utnModalImportProduct);


  /* @ngInject */
  function utnModalImportProduct() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/product/modal-import/modal-import-product.html',
      controller: ModalImportProductController,
      controllerAs: 'mImportProduct',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalImportProductController(rProduct, rBrand, rSpeedRating, rLoadIndex, SweetAlert, $rootScope, toastr, Upload) {
      var vm = this;
      vm.status = true;
      vm.newProduct = {status:true};

      vm.productTypeList = [{id:1, name:'Llanta'}, {id:2, name:'Aro'}];

      vm.newProduct.typeProduct = vm.productTypeList[0];
      vm.newProduct.status = true;

      vm.importProduct = importProduct;
      vm.dismissModal = dismissModal;
      vm.uploadFiles = uploadFiles;

      function init () {
        vm.newProduct = {status:true};
      }
      init();

      function uploadFiles(file) {
        vm.photo = file;
        vm.invalidPhoto = false;
        vm.newProduct.file = file;

        vm.test = Upload.json('C:/Users/Emotion/Desktop/product.xlsx');

        // if (file){
        //   Upload.base64DataUrl(file).then(function(url){
        //     vm.newPerson.photoBase64 = url.split('data:image/jpeg;base64,')[1];
        //     if (!vm.newPerson.photoBase64) {
        //       vm.newPerson.photoBase64 = url.split('data:image/png;base64,')[1];
        //     }
        //   });
        // }else{
        //  if (invalid) {
        //    vm.invalidPhoto = true;
        //  }
        //  }
      }


      function importProduct(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(!vm.photo){
          toastr.error('Debe elegir un archivo de excel');
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }


        rProduct.importProducts(vm.newProduct, function(){
          vm.newProduct = {};
          vm.photo = '';
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Excel Importado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                form.$setPristine();
              }else{
                angular.element('#modalImportProduct').modal('hide');
              }
              $rootScope.$broadcast('productEdited');
            }
          });
        vm.newProduct = {status:true, typeProduct: vm.productTypeList[0]};
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al Importar Excel');
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
              vm.newProduct = {};
              vm.photo = '';
              vm.newProduct = {status:true, typeProduct: vm.productTypeList[0]};
              if (isConfirm) {
                angular.element('#modalImportProduct').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalImportProduct').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalImportProduct').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newProduct = {};
        init();
      });

    }
  }
})();
