(function() {
  'use strict';

  angular
  .module('utn')
  .controller('TrackingController', TrackingController);

  /** @ngInject */
  function TrackingController(rTracking, rWarehouse, $log, $window, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, $timeout, moment, PAGINATION_CONFIG, DATE_ISO_FORMAT, authenticationService) {
    var vm = this,
    trackingEdited;

    vm.enabled = false;
    vm.all = true;

    vm.query = {};
    vm.ubicationToWork = {};
    vm.selectedItem = {};

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
      vm.user = userInfo[0].user;
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

    vm.searchTracking = searchTracking;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.setSaleOrder = setSaleOrder;
    vm.setPrepareOrder = setPrepareOrder;
    vm.setTransfer = setTransfer;
    vm.setInvoice = setInvoice;
    vm.setRoad = setRoad;
    vm.setAll = setAll;

    vm.loadTracking = loadTracking;

    function init () {
      loadTracking(vm.sort, vm.direction);
    }
    init();

    function loadTracking(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'tracking-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;
      vm.query.status = null;

      vm.all = true;

      if(vm.saleOrder){
        vm.all = false;
        vm.query.status = 1; 
      }

      if(vm.prepareOrder){
        vm.all = false;
        vm.query.status = 2; 
      }

      if(vm.transfer){
        vm.all = false;
        vm.query.status = 3; 
      }

      if(vm.invoice){
        vm.all = false;
        vm.query.status = 4; 
      }

      if(vm.road){
        vm.all = false;
        vm.query.status = 5; 
      }

      rTracking.query(vm.query, function(result){
        vm.trackingList  = result.records;

        angular.forEach(vm.trackingList, function(item){
          item.updatedAt = moment(item.updatedAt, DATE_ISO_FORMAT).toDate();

          if(item.document.WarehouseId){
            rWarehouse.query({id:item.document.WarehouseId}, function(resWarehouse){
              if(resWarehouse){
                item.warehouseName = resWarehouse.name;
              }
            }, function () {
              toastr.error('Error al obtener los datos del Seguimiento.');
            }); 
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'tracking-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'tracking-overlay'});
      });
    }

    function setSaleOrder(){
      vm.saleOrder = true;
      vm.prepareOrder = false;
      vm.transfer = false;
      vm.invoice = false;
      vm.road = false;
      vm.all = false;
      loadTracking();
    }

    function setPrepareOrder(){
      vm.saleOrder = false;
      vm.prepareOrder = true;
      vm.transfer = false;
      vm.invoice = false;
      vm.road = false;
      vm.all = false;
      loadTracking();
    }

    function setTransfer(){
      vm.saleOrder = false;
      vm.prepareOrder = false;
      vm.transfer = true;
      vm.invoice = false;
      vm.road = false;
      vm.all = false;
      loadTracking();
    }

    function setInvoice(){
      vm.saleOrder = false;
      vm.prepareOrder = false;
      vm.transfer = false;
      vm.invoice = true;
      vm.road = false;
      vm.all = false;
      loadTracking();
    }

    function setRoad(){
      vm.saleOrder = false;
      vm.prepareOrder = false;
      vm.transfer = false;
      vm.invoice = false;
      vm.road = true;
      loadTracking();
    }

    function setAll(){
      vm.saleOrder = false;
      vm.prepareOrder = false;
      vm.transfer = false;
      vm.invoice = false;
      vm.road = false;
      vm.all = true;
      loadTracking();
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadTracking();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadTracking();
    }

    function range (n) {
      return new Array(n);
    }

    function searchTracking(){
      vm.pageNum = 1;
      loadTracking();
    }

    trackingEdited = $rootScope.$on('trackingEdited', function() {
      vm.query.filter = null;
      loadTracking();
    });

    $rootScope.$on('$destroy', trackingEdited);

  }
})();
