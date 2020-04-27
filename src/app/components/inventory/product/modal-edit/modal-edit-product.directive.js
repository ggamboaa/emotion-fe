(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditProduct', utnModalEditProduct);


  /* @ngInject */
  function utnModalEditProduct() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/product/modal-edit/modal-edit-product.html',
      controller: ModalEditProductController,
      controllerAs: 'mEditProduct',
      bindToController: true,
      scope:{
        selectedProduct: '='
      }

    };

    return directive;

    /** @ngInject */
    function ModalEditProductController(rProduct, rBrand, rSpeedRating, rLoadIndex, SweetAlert, $rootScope, toastr) {
      var vm = this;
    
      vm.productTypeList = [{id:1, name:'Llanta'}, {id:2, name:'Aro'}];

      vm.searchBrand = searchBrand;
      vm.searchLoadIndex = searchLoadIndex;
      vm.searchSpeedRating = searchSpeedRating;

      vm.editProduct = editProduct;
      vm.dismissModal = dismissModal;
      vm.validation = validation;

      function productToEdit(){
        rProduct.query({id:vm.selectedProduct.id}, function(result){
          vm.productEdited  = result;

          vm.productEdited.typeProductDup = (vm.productEdited.typeProduct == 1) ? vm.productTypeList[0] : vm.productTypeList[1];

          vm.productEdited.status = (vm.productEdited.status == 1)? true:false;

        });
      }

      function init () {
        loadProduct();
        loadBrand();
        loadLoadIndex();
        loadSpeedRating();
      }
      init();

      function loadProduct(){
        rProduct.query(function(result){
          vm.productList  = result.records;
        });
      }

      function loadBrand(){
        rBrand.query(function(result){
          vm.brandList  = result.records;
        });
      }

      function searchBrand(filter){
        if(filter.search == ''){
          loadBrand();
        }else{
          vm.query = {filter: filter.search};
          rBrand.query(vm.query, function (result) {
            vm.brandList = result.records;
          });
        }
      }

      function loadLoadIndex(){
        rLoadIndex.query(function(result){
          vm.loadIndexList  = result.records;
        });
      }

      function searchLoadIndex(filter){
        if(filter.search == ''){
          loadLoadIndex();
        }else{
          vm.query = {filter: filter.search};
          rLoadIndex.query(vm.query, function (result) {
            vm.loadIndexList = result.records;
          });
        }
      }

      function loadSpeedRating(){
        rSpeedRating.query(function(result){
          vm.speedRatingList  = result.records;
        });
      }

      function searchSpeedRating(filter){
        if(filter.search == ''){
          loadSpeedRating();
        }else{
          vm.query = {filter: filter.search};
          rSpeedRating.query(vm.query, function (result) {
            vm.speedRatingList = result.records;
          });
        }
      }


      function validation(){
        if(vm.productEdited.typeProductDup.id == 1){
          vm.productEdited.basin = null;
          vm.productEdited.basin2 = null;
          vm.productEdited.diameter = null;
          vm.productEdited.measure = null;
          vm.productEdited.offset = null;
          vm.productEdited.centerHole = null;
        }
        else{
          vm.productEdited.loadIndex = null;
          vm.productEdited.speedRating = null;
          vm.productEdited.width = null;
          vm.productEdited.series = null;
          vm.productEdited.size = null;
        }
      }

      function editProduct(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.productEdited.typeProductDup){
          vm.productEdited.typeProduct = vm.productEdited.typeProductDup.id; 
        }

        if(vm.productEdited.speedRating){
          vm.productEdited.SpeedRatingId = vm.productEdited.speedRating.id; 
        }

        if(vm.productEdited.loadIndex){
          vm.productEdited.LoadIndexId = vm.productEdited.loadIndex.id; 
        }

        if(vm.productEdited.brand){
          vm.productEdited.brandId = vm.productEdited.brand.id; 
        }

        rProduct.update(vm.productEdited, function(){
          vm.productEdited = {};
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Producto actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditProduct').modal('hide');
              $rootScope.$broadcast('productEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Producto');
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
              vm.productEdited = {};
              if (isConfirm) {
                angular.element('#modalEditProduct').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalEditProduct').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditProduct').on('shown.bs.modal', function(){
        productToEdit();
      });

      angular.element('#modalEditProduct').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.productToEdit = {};
        init();
      });

    }
  }
})();
