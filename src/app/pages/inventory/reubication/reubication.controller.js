(function() {
  'use strict';

  angular
  .module('utn')
  .controller('ReubicationController', ReubicationController);

  /** @ngInject */
  function ReubicationController(rUbicationProduct, rUbication, rProduct, rDocument, rWarehouse, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, $timeout, $window, authenticationService, PAGINATION_CONFIG) {
    var vm = this,
    reubicationEdited;

    vm.query = {};
    vm.newUbication = {};

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

    vm.searchReubication = searchReubication;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadReubication = loadReubication;
    vm.makeStock = makeStock;
    vm.searchUbication = searchUbication;
    //vm.deleteUbication = deleteUbication;
    //vm.updateStatus = updateStatus;

    function init () {
      vm.warehouse = userInfo[0].warehouseSelected;
      checkWarehouses();
      //loadReubication(vm.sort, vm.direction);
    }
    init();

    function loadReubication(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'reubication-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.UbicationId = null;
      if(vm.ubication){ 
        vm.query.UbicationId = vm.ubication.id; 
      }

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){ 
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id; 
      }

      rUbicationProduct.query(vm.query, function(result){
        vm.reubicationList  = result.records;

        angular.forEach(vm.reubicationList, function(item){
          
          if(item.WarehouseId){
            rWarehouse.query({id:item.WarehouseId}, function(resWarehouse){
              if(resWarehouse){
                item.warehouseName = resWarehouse.name;
              }
            }, function () {
              toastr.error('Error al obtener los datos de la Sucursal.');
            }); 
          }

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
                item.productCode = resProduct.code;
                item.productName = resProduct.name;
              }
            }, function () {
              toastr.error('Error al obtener los datos del Producto.');
            }); 
          }

          if(item.DocumentId){
            rDocument.query({id:item.DocumentId}, function(resDocument){
              if(resDocument){
                item.code = resDocument.code;
              }
            }, function () {
              toastr.error('Error al obtener los datos del Documento.');
            }); 
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'reubication-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'reubication-overlay'});
      });
      bsLoadingOverlayService.stop({referenceId: 'reubication-overlay'});
    }

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
      loadReubication();
    }

    function makeStock(ubication){
      vm.selectedUbication = ubication;
      vm.selectedUbication.showMe = false; 
      angular.element('#modalEditStore').modal({backdrop: 'static', keyboard: false});
    }

    function loadUbication(){
      if(vm.warehouse){
        rUbication.findByWarehouseId({id:vm.warehouse.id}, function(result){
          vm.ubicationList  = result.records;
        });
      }
    }

    function searchUbication(filter){
      if(filter.search == '' && vm.warehouse){
        loadUbication();
      }else{
        vm.query = {id:vm.warehouse.id, filter: filter.search};
        rUbication.findByWarehouseId(vm.query, function (result) {
          vm.ubicationList = result.records;
        });
      }
    }

    /*function deleteUbication(item){
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
          rUbicationProduct.delete({id:item.id}, function () {
            toastr.info('Almacenamiento eliminado satisfactoriamente', {
              onShown: function () {
                loadReubication();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Almacenamiento');
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
            rUbicationProduct.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadReubication();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadReubication();
          }
        }
      );
    }*/

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadReubication();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadReubication();
    }

    function range (n) {
      return new Array(n);
    }

    function searchReubication(){
      vm.pageNum = 1;
      loadReubication();
    }

    reubicationEdited = $rootScope.$on('reubicationEdited', function() {
      vm.query.filter = null;
      checkWarehouses();
    });

    $rootScope.$on('$destroy', reubicationEdited);

  }
})();
