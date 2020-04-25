(function() {
  'use strict';

  angular
  .module('utn')
  .controller('JourneyController', JourneyController);

  /** @ngInject */
  function JourneyController(rJourney, rCustomer, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, moment, PAGINATION_CONFIG, DATE_ISO_FORMAT,
    authenticationService, $timeout, $window) {
    var vm = this,
    journeyEdited;

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
      vm.user = userInfo[0].user;
    }

    vm.query = {};
    vm.newJourney = {};
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

    vm.searchJourney = searchJourney;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadJourney = loadJourney;
    vm.createJourney = createJourney;
    vm.editJourney = editJourney;
    vm.deleteJourney = deleteJourney;
    vm.updateStatus = updateStatus;

    function init () {
      // loadJourney(vm.sort, vm.direction);
      checkWarehouses();
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
        toastr.error('El usuario no tiene Sucursales asociadas. Verifíque !');
      }
      loadJourney();
    }

    function loadJourney(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'journey-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id;
        vm.enabled = true;
      }

      rJourney.query(vm.query, function(result){
        vm.journeyList  = result.records;

        // angular.forEach(vm.journeyList, function(item){
        //   item.date = moment(item.date, DATE_ISO_FORMAT).toDate();
        // });

        angular.forEach(vm.journeyList, function(item){
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
        bsLoadingOverlayService.stop({referenceId: 'journey-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'journey-overlay'});
      });
    }

    function createJourney(){
      angular.element('#modalCreateJourney').modal({backdrop: 'static', keyboard: false});
    }

    function editJourney(journey){
      vm.selectedJourney = journey;
      angular.element('#modalEditJourney').modal({backdrop: 'static', keyboard: false});
    }

    function deleteJourney(item){
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
          rJourney.delete({id:item.id}, function () {
            toastr.info('Cambio de Aceite eliminado satisfactoriamente', {
              onShown: function () {
                loadJourney();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Cambio de Aceite');
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
            rJourney.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadJourney();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadJourney();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadJourney();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadJourney();
    }

    function range (n) {
      return new Array(n);
    }

    function searchJourney(){
      vm.pageNum = 1;
      loadJourney();
    }

    journeyEdited = $rootScope.$on('journeyEdited', function() {
      vm.query.filter = null;
      loadJourney();
    });

    $rootScope.$on('$destroy', journeyEdited);

  }
})();
