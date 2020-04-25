(function() {
  'use strict';

  angular
  .module('utn')
  .controller('ProductController', ProductController);

  /** @ngInject */
  function ProductController(rProduct, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    productEdited;

    vm.query = {};
    vm.newProduct = {};

    // sort vars
    vm.direction = 'DESC';
    vm.sort = 'id';

    //pagination vars:
    vm.rangeSelected = PAGINATION_CONFIG.allowedRanges[0];
    vm.pageNum = 1;
    vm.prevPage = 0;
    vm.nextPage = 0;
    vm.totalPages = 0;
    vm.totalRecords = 0;
    vm.numberOfPageRecords = 0;
    vm.allowedRanges = PAGINATION_CONFIG.allowedRanges;
    vm.maxPaginationItems = PAGINATION_CONFIG.maxPaginationItems;

    vm.searchProduct = searchProduct;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadProduct = loadProduct;
    vm.createProduct = createProduct;
    vm.importProduct = importProduct;
    vm.editProduct = editProduct;
    vm.deleteProduct = deleteProduct;
    vm.updateStatus = updateStatus;

    function init () {
      loadProduct(vm.sort, vm.direction);
    }
    init();

    function loadProduct(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'product-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rProduct.query(vm.query, function(result){
        vm.productList  = result.records;

        angular.forEach(vm.productList, function(item){
          if(item.status == 1){
            item.status = true;
          }
          if(item.typeProduct == 1){
            item.typeProductName = "Llanta";
          }else{
            item.typeProductName = "Aro";
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'product-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'product-overlay'});
      });
    }

    function importProduct(){
      angular.element('#modalImportProduct').modal({backdrop: 'static', keyboard: false});
    }

    function createProduct(){
      angular.element('#modalCreateProduct').modal({backdrop: 'static', keyboard: false});
    }

    function editProduct(product){
      vm.selectedProduct = product;
      angular.element('#modalEditProduct').modal({backdrop: 'static', keyboard: false});
    }

    function deleteProduct(item){
      SweetAlert.swal({
        title:'',
        text: '¿Desea eliminar el registro seleccionado?',
        showCancelButton: true,
        confirmButtonText:'Sí',
        cancelButtonText:'No',
        closeOnConfirm: true,
        closeOnCancel: true,
        allowEscapeKey: false
      },
      function(isConfirm){
        if (isConfirm) {
          rProduct.delete({id:item.id}, function () {
            toastr.info('Producto eliminada satisfactoriamente', {
              onShown: function () {
                loadProduct();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Producto');
          });
        }
      }
      );
    }

    function updateStatus(item){
      SweetAlert.swal({
          title:'',
          text: '¿Desea cambiar el estado del registro seleccionado?',
          showCancelButton: true,
          confirmButtonText:'Sí',
          cancelButtonText:'No',
          closeOnConfirm: true,
          closeOnCancel: true,
          allowEscapeKey: false
        },
        function(isConfirm){
          if (isConfirm) {
            rProduct.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadProduct();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadProduct();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadProduct();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadProduct();
    }

    function range (n) {
      return new Array(n);
    }

    function searchProduct(){
      vm.pageNum = 1;
      loadProduct();
    }

    productEdited = $rootScope.$on('productEdited', function() {
      vm.query.filter = null;
      loadProduct();
    });

    $rootScope.$on('$destroy', productEdited);

  }
})();
