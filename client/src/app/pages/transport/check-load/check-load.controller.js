(function() {
  'use strict';

  angular
  .module('utn')
  .controller('CheckLoadController', CheckLoadController);

  /** @ngInject */
  function CheckLoadController(rCheckLoad, rSaleOrder, rDocument, rUbicationProduct, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, $timeout,
    PAGINATION_CONFIG, authenticationService, $window, rCustomer) {
    var vm = this,

    checkLoadEdited;
    vm.enabled = false;

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
      vm.user = userInfo[0].user;
      // vm.warehouse = vm.userConected.warehouseSelected;
    }

    vm.query = {};
    vm.ubicationToWork = {};

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

    vm.searchCheckLoad = searchCheckLoad;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadCheckLoad = loadCheckLoad;
    vm.editCheckLoad = editCheckLoad;

    function init () {
      checkWarehouses();
      // loadCheckLoad(vm.sort, vm.direction);
    }
    init();

    function checkWarehouses() {
      if (authenticationService.getUserInfo().warehouseList.length > 1 && !authenticationService.getUserInfo()[0].warehouseSelected) {
        $timeout(function() {
          angular.element('#modalSelectWarehouse').modal({backdrop: 'static', keyboard: false});
        }, 500);
      } else if(authenticationService.getUserInfo().warehouseList.length === 1 && !authenticationService.getUserInfo()[0].warehouseSelected) {
        authenticationService.getUserInfo()[0].warehouseSelected = userInfo.warehouseList[0];
        $window.localStorage['userInfo'] = angular.toJson(authenticationService.getUserInfo());
      } else if (authenticationService.getUserInfo().warehouseList.length === 0 && !authenticationService.getUserInfo()[0].warehouseSelected){
        toastr.error('El usuario no tiene Sucurchecks asociadas. Verifíque !');
      }
      loadCheckLoad();
    }

    function loadCheckLoad(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'checkLoad-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = 1;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.enabled = true;
      }

      vm.query.typeDoc = 5;

      rCheckLoad.query(vm.query, function(result){
        vm.checkLoadList  = result.records;

        angular.forEach(vm.checkLoadList, function(item){
          if(item.Document_Detail != null){
            rCustomer.query({id: item.Document_Detail.CustomerId}, function(res){
              item.customer = res;
            });
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'checkLoad-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'checkLoad-overlay'});
      });

      //loadUbicationProductList();
    }

    function editCheckLoad(item){
      vm.selectedCheckLoad = item;
      angular.element('#modalEditCheckLoad').modal({backdrop: 'static', keyboard: false});
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadCheckLoad();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadCheckLoad();
    }

    function range (n) {
      return new Array(n);
    }

    function searchCheckLoad(){
      vm.pageNum = 1;
      loadCheckLoad();
    }

    checkLoadEdited = $rootScope.$on('checkLoadEdited', function() {
      vm.query.filter = null;
      loadCheckLoad();
    });

    $rootScope.$on('$destroy', checkLoadEdited);

  }
})();
