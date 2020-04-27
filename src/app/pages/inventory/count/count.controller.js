(function() {
  'use strict';

  angular
  .module('utn')
  .controller('CountController', CountController);

  /** @ngInject */
  function CountController(rUbicationProduct, rWarehouse, rProduct, rUbication, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG, authenticationService) {
    var vm = this,
    CountEdited;

    vm.query = {};
    vm.newCount = {};
    vm.selectedItems = [];
    vm.enabled = false;

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

    vm.searchCount = searchCount;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadCount = loadCount;
    vm.checkAll = checkAll;
    vm.checkItem = checkItem;
    vm.doCounting = doCounting;

    function init () {
      vm.selectedItems = [];
      loadCount(vm.sort, vm.direction);
    }
    init();

    function loadCount(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'count-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.UbicationId = null;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.enabled = true;
      }

      rUbicationProduct.query(vm.query, function(result){
        vm.countList  = result.records;

        angular.forEach(vm.countList, function(item){

          // if(item.WarehouseId){
          //   rWarehouse.query({id:item.WarehouseId}, function(resWarehouse){
          //     if(resWarehouse){
          //       item.warehouseName = resWarehouse.name;
          //     }
          //   }, function () {
          //     toastr.error('Error al obtener los datos de la Sucursal.');
          //   });
          // }

          if(item.UbicationId){
            rUbication.query({id:item.UbicationId}, function(resUbication){
              if(resUbication){
                item.ubicationName = resUbication.ubicationName;
              }
            }, function () {
              toastr.error('Error al obtener los datos de la Ubicación.');
            });
          }

          if(item.ProductId){
            rProduct.query({id:item.ProductId}, function(resProduct){
              if(resProduct){
                item.product = resProduct;

                if(item.product.typeProduct === 1){
                  item.measure = item.product.width + '/' + item.product.series + item.product.size;
                }else{
                  item.measure = item.product.measure;
                }

              }
            }, function () {
              toastr.error('Error al obtener los datos del Producto.');
            });
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'count-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'count-overlay'});
      });
    }

    function doCounting(){
      if(vm.selectedItems.length > 0){
        angular.element('#modalCount').modal({backdrop: 'static', keyboard: false});
      }else{
        toastr.error('Debe seleccionar al menos un Producto', 'Error al realizar conteo.');
      }
    }

    function checkAll(isCheck) {
      if (isCheck) {
        angular.forEach(vm.countList,function(item) {
          if (!containsItem(item)) {
            vm.selectedItems.push(item.id);
          }
        });
      }else{
        angular.forEach(vm.countList, function(item) {
          removeItem(item);
        });
      }
    }

    function checkItem() {
      vm.allItems = functionAllChecked();
    }

    function containsItem(item) {
      var items = vm.selectedItems;
      for (var i = 0; i < items.length; i++) {
          if (items[i] === item.id) {
            return true;
          }
      }
      return false;
    }

    function removeItem(item) {
      var array = vm.selectedItems;
        for(var i in array){
            if(array[i]==item.id){
                array.splice(i,1);
                break;
            }
        }
    }

    function functionAllChecked() {
      var result = true;
      angular.forEach(vm.countList, function(item) {
        if (result) {
          if (!containsItem(item)) {
            result = false;
          }
        }
      });
      return result;
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadCount();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadCount();
    }

    function range (n) {
      return new Array(n);
    }

    function searchCount(){
      vm.pageNum = 1;
      loadCount();
    }

    CountEdited = $rootScope.$on('countEdited', function() {
      vm.query.filter = null;
      vm.selectedItems = [];
      vm.allItems = false;
      loadCount();
    });

    $rootScope.$on('$destroy', CountEdited);

  }
})();
