(function() {
  'use strict';

  angular
  .module('utn')
  .controller('ReorderPointController', ReorderPointController);

  /** @ngInject */
  function ReorderPointController(rReorderPoint, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr,
   PAGINATION_CONFIG, authenticationService, $timeout, $window) {
    var vm = this,
    reOrderPointEdited;

    vm.query = {};
    vm.newReorderPoint = {};
    vm.viewList = [{id:1, name:'Consultas'}, {id:2, name:'Puntos de Reorden'}];

    vm.userConected = false;
    vm.enabled = false;

    var userInfo = authenticationService.getUserInfo();
    if(userInfo.length > 0){
      vm.userConected = userInfo[0];
      vm.user = userInfo[0].user;
      // vm.warehouse = vm.userConected.warehouseSelected;
    }

    angular.forEach(userInfo.permissions, function(item){
      if(item == "Administrador" || item == "Inventario")
        vm.userConected = true;
    })

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

    vm.searchReorderPoint = searchReorderPoint;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;
    vm.checkWarehouses = checkWarehouses;

    vm.loadReorderPoint = loadReorderPoint;
    vm.createReorderPoint = createReorderPoint;
    vm.editReorderPoint = editReorderPoint;
    vm.deleteReorderPoint = deleteReorderPoint;
    vm.updateStatus = updateStatus;

    function init () {
      vm.typeView = vm.viewList[1];
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
      loadReorderPoint();
    }

    function loadReorderPoint(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'reorderPoint-overlay'});

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

      rReorderPoint.query(vm.query, function(result){
        vm.reorderPointList  = result.records;

        angular.forEach(vm.reorderPointList, function(item){
          if(item.Product.Reorder_Points[0].status == '1'){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'reorderPoint-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'reorderPoint-overlay'});
      });
    }

    function createReorderPoint(){
      angular.element('#modalCreateReorderPoint').modal({backdrop: 'static', keyboard: false});
    }

    function editReorderPoint(item){
      vm.selectedReorderPoint = item;
      angular.element('#modalEditReorderPoint').modal({backdrop: 'static', keyboard: false});
    }

    function deleteReorderPoint(item){
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
          rReorderPoint.delete({id:item.Product.Reorder_Points[0].id}, function () {
            toastr.info('Punto de Reorden eliminado satisfactoriamente', {
              onShown: function () {
                loadReorderPoint();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar el Punto de Reorden');
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
            var pStatus = item.Product.Reorder_Points[0].status;
            if(pStatus == 1){
              pStatus = 0;
            }
            else{
              pStatus = 1;
            }
            rReorderPoint.changeStatus({id:item.Product.Reorder_Points[0].id, status: pStatus}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadReorderPoint();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadReorderPoint();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadReorderPoint();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadReorderPoint();
    }

    function range (n) {
      return new Array(n);
    }

    function searchReorderPoint(){
      vm.pageNum = 1;
      loadReorderPoint();
    }

    reOrderPointEdited = $rootScope.$on('reOrderPointEdited', function() {
      vm.query.filter = null;
      loadReorderPoint();
    });

    $rootScope.$on('$destroy', reOrderPointEdited);

  }
})();
