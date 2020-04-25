(function() {
  'use strict';

  angular
  .module('utn')
  .controller('PrepareOrderController', PrepareOrderController);

  /** @ngInject */
  function PrepareOrderController(rDocument, rPrepareOrder, rUbicationProduct, $log, $rootScope, SweetAlert, bsLoadingOverlayService,
    toastr, PAGINATION_CONFIG, DATE_ISO_FORMAT, authenticationService, moment) {
    var vm = this,
    prepareOrderEdited;

    vm.query = {};
    vm.newPrepareOrder = {};
    vm.DocumentPrepareOrder = 0;

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
    }

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

    vm.searchPrepareOrder = searchPrepareOrder;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.cancelOrder = cancelOrder;
    vm.changeTable = changeTable;
    vm.loadUbicationProducts = loadUbicationProducts;


    vm.loadPrepareOrder = loadPrepareOrder;
    vm.makeStock = makeStock;
    //vm.deletePrepareOrder = deletePrepareOrder;
    //vm.updateStatus = updateStatus;

    function init () {
      loadPrepareOrder(vm.sort, vm.direction);
    }
    init();

    function reloadList(){
      vm.rangeSelected = PAGINATION_CONFIG.allowedRanges[0];
      vm.pageNum = 1;
      vm.prevPage = 0;
      vm.nextPage = 0;
      vm.totalPages = 0;
      vm.totalRecords = 0;
      vm.numberOfPageRecords = 0;
      vm.allowedRanges = PAGINATION_CONFIG.allowedRanges;
      vm.maxPaginationItems = PAGINATION_CONFIG.maxPaginationItems;
    }

    function changeTable(value){
      vm.DocumentPrepareOrder = value;
      if(vm.DocumentPrepareOrder != 0){
        reloadList();
        loadUbicationProducts();
        vm.documentSelected = value;
      }
      else{
        reloadList();
        loadPrepareOrder();
      }
    }

    function loadUbicationProducts(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'prepareOrder-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = 0;

      vm.query.DocumentId = vm.DocumentPrepareOrder.id;

      rPrepareOrder.getProducts(vm.query, function(result){
        vm.ubicationProductList  = result.records.rows;

        if(vm.ubicationProductList.length < 1){
          vm.prepareOrderList = [];
          changeTable(0);
        }

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'prepareOrder-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'prepareOrder-overlay'});
      });
      bsLoadingOverlayService.stop({referenceId: 'prepareOrder-overlay'});
    }

    function loadPrepareOrder(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'prepareOrder-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = 0;

      vm.query.WarehouseId = null;

      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
      }

      rPrepareOrder.query(vm.query, function(result){
        vm.prepareOrderList  = result.records;

        angular.forEach(vm.prepareOrderList, function(item){
          if(item.status == 1){
            item.status = true;
          }
          
          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'prepareOrder-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'prepareOrder-overlay'});
      });
      bsLoadingOverlayService.stop({referenceId: 'prepareOrder-overlay'});
    }

    function makeStock(prepareOrder){
      prepareOrder.documentSelected = vm.documentSelected
      vm.selectedPrepareOrder = prepareOrder;
      angular.element('#modalEditPrepareOrder').modal({backdrop: 'static', keyboard: false});
    }

    function cancelOrder(prepareOrder){
      vm.selectedPrepareOrder = prepareOrder;
      angular.element('#modalCancelPrepareOrder').modal({backdrop: 'static', keyboard: false});
    }



    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      // loadPrepareOrder();
      if(vm.DocumentPrepareOrder != 0){
        loadUbicationProducts();
      }
      else{
        loadPrepareOrder();
      }
    }

    function goToPage (p) {
      vm.pageNum = p;
      if(vm.DocumentPrepareOrder != 0){
        loadUbicationProducts();
      }
      else{
        loadPrepareOrder();
      }
    }

    function range (n) {
      return new Array(n);
    }

    function searchPrepareOrder(){
      vm.pageNum = 1;
      if(vm.DocumentPrepareOrder != 0){
        loadUbicationProducts();
      }
      else{
        loadPrepareOrder();
      }
    }

    prepareOrderEdited = $rootScope.$on('prepareOrderEdited', function() {
      vm.query.filter = null;
      loadPrepareOrder();
      loadUbicationProducts();
    });

    $rootScope.$on('$destroy', prepareOrderEdited);

  }
})();
