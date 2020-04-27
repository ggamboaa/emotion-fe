(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateProduct', utnModalCreateProduct);


  /* @ngInject */
  function utnModalCreateProduct() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/product/modal-create/modal-create-product.html',
      controller: ModalCreateProductController,
      controllerAs: 'mCreateProduct',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateProductController(rProduct, rBrand, rSpeedRating, rLoadIndex, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;
      vm.newProduct = {status:true};

      vm.productTypeList = [{id:1, name:'Llanta'}, {id:2, name:'Aro'}];

      vm.searchBrand = searchBrand;
      vm.searchSpeedRating = searchSpeedRating;
      vm.searchLoadIndex = searchLoadIndex;

      vm.newProduct.typeProduct = vm.productTypeList[0];
      vm.newProduct.status = true;

      vm.createProduct = createProduct;
      vm.dismissModal = dismissModal;
      vm.validation = validation;

      function init () {
        vm.newProduct = {status:true};
        loadProducts();
        loadBrands();
        loadLoadIndex();
        loadSpeedRating();
      }
      init();

      function loadProducts(){
        rProduct.query(function(result){
          vm.productList  = result.records;
        });
      }

      function loadBrands(){
        rBrand.query(function(result){
          vm.brandList  = result.records;
        });
      }

      function searchBrand(filter){
        if(filter.search == ''){
          loadBrands();
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
        if(vm.newProduct.typeProductDup.id == 1){
          vm.newProduct.basin = null;
          vm.newProduct.basin2 = null;
          vm.newProduct.diameter = null;
          vm.newProduct.measure = null;
          vm.newProduct.offset = null;
          vm.newProduct.centerHole = null;
        }
        else{
          vm.newProduct.loadIndex = null;
          vm.newProduct.speedRating = null;
          vm.newProduct.width = null;
          vm.newProduct.series = null;
          vm.newProduct.size = null;
        }
      }

      function createProduct(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newProduct.typeProductDup){
          vm.newProduct.typeProduct = vm.newProduct.typeProductDup.id; 
        }

        if(vm.newProduct.speedRating){
          vm.newProduct.SpeedRatingId = vm.newProduct.speedRating.id; 
        }

        if(vm.newProduct.loadIndex){
          vm.newProduct.LoadIndexId = vm.newProduct.loadIndex.id; 
        }

        if(vm.newProduct.brand){
          vm.newProduct.brandId = vm.newProduct.brand.id; 
        }

        rProduct.save(vm.newProduct, function(){
          vm.newProduct = {};
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Producto registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                form.$setPristine();
              }else{
                angular.element('#modalCreateProduct').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Producto');
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
              vm.newProduct = {status:true, typeProduct: vm.productTypeList[0]};
              if (isConfirm) {
                angular.element('#modalCreateProduct').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalCreateProduct').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateProduct').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newProduct = {};
        init();
      });

    }
  }
})();
