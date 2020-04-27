(function() {
  'use strict';

  angular
  .module('utn')
  .controller('ReturnController', ReturnController);

  /** @ngInject */
  function ReturnController(rDocument, rWarehouse, $log, $window, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, moment, $timeout, PAGINATION_CONFIG, DATE_ISO_FORMAT, authenticationService) {
    var vm = this,
    returnEdited;

    vm.actions = [{ id:'1', name:'Editar' }, { id:'2', name:'Cerrar' }, { id:'3', name:'Eliminar' }];
    vm.query = {};
    vm.ubicationToWork = {};
    vm.selectedItem = {};
    vm.enabled = false;

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

    vm.searchReturn = searchReturn;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadReturn = loadReturn;
    vm.createReturn = createReturn;
    //vm.deleteStore = deleteStore;
    //vm.updateStatus = updateStatus;

    vm.performAction = performAction;

    function init () {
      checkWarehouses();
      //loadReturn(vm.sort, vm.direction);
    }
    init();

    function loadReturn(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'return-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      vm.query.status = [1];
      vm.query.typeDoc = 4;

      vm.query.WarehouseId = null;
      if(authenticationService.getUserInfo()[0].warehouseSelected){ 
        vm.query.WarehouseId = authenticationService.getUserInfo()[0].warehouseSelected.id; 
        vm.enabled = true;
      }

      rDocument.query(vm.query, function(result){
        vm.returnList  = result.records;

        angular.forEach(vm.returnList, function(item){
          if(item.status == '1'){
            item.status = true;
          }

          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();

          if(item.WarehouseId){
            rWarehouse.query({id:item.WarehouseId}, function(resWarehouse){
              if(resWarehouse){
                item.warehouseName = resWarehouse.name;
              }
            }, function () {
              toastr.error('Error al obtener los datos de la Sucursal.');
            }); 
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'return-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'return-overlay'});
      });
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
      loadReturn();
    }

    function performAction(_return) {
      if (_return) {
        var action = parseInt(_return.action);
        switch (action) {
          case 1:
              editReturn(_return);
            break;
          case 2:
            if ($rootScope.hasPermissionsFor('Administrador') || $rootScope.hasPermissionsFor('Inventario')) {
              closeReturn(_return);
            } else {
              toastr.info('No tiene permisos para cerrar');
            }
            break;
          case 3:
              deleteReturn(_return);
            break;
        }
      }
      $timeout(function () {
        angular.element('.actions-return').selectpicker('deselectAll');
      }, 500);
    }

    function createReturn(){
      vm.selectedItem.showMe = false;
      angular.element('#modalCreateDocument').modal({backdrop: 'static', keyboard: false});
    }

    function editReturn(_return){
      vm.selectedItem = _return;
      vm.selectedItem.showMe = false;
      angular.element('#modalEditDocument').modal({backdrop: 'static', keyboard: false});
    }

     function closeReturn(item){
      if(item.Products.length > 0){
        SweetAlert.swal({
          title:'',
          text: '¿Desea cerrar el registro seleccionado?',
          showCancelButton: true,
          confirmButtonText:'Sí',
          cancelButtonText:'No',
          closeOnConfirm: true,
          closeOnCancel: true,
          allowEscapeKey: false
        },
        function(isConfirm){
          if (isConfirm) {
            vm.ubicationToWork.id = item.id;
            vm.ubicationToWork.status = 0;
            vm.ubicationToWork.rowInsert = [];
            angular.forEach(item.Products, function(pItem){
              vm.ubicationToWork.WarehouseId = pItem.Document_Product_List.WarehouseId;
              var row = {};
              row.DocumentId = pItem.Document_Product_List.DocumentId;
              row.UbicationId = 0;
              row.ProductId = pItem.Document_Product_List.ProductId;
              row.WarehouseId = pItem.Document_Product_List.WarehouseId;
              row.quantity = pItem.Document_Product_List.quantity;
              row.status = 0;
              row.user = vm.user;
              vm.ubicationToWork.rowInsert.push(row);
            })

            rDocument.close(vm.ubicationToWork, function () {
              toastr.info('Devolución cerrada satisfactoriamente', {
                onShown: function () {
                  init();
                }
              });
            }, function(error){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error(error.data.message, 'Error al cerrar Devolución');
            });
          }
        });
      }else{
        toastr.error('La Devolución debe contener al menos un Producto asociado', 'Error al cerrar Devolución');
      }
    }

    function deleteReturn(item){
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
          rDocument.delete({id:item.id}, function () {
            toastr.info('Devolución eliminada satisfactoriamente', {
              onShown: function () {
                loadReturn();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Devolución');
          });
        }
      });
    }

    // function updateStatus(item){
    //   SweetAlert.swal({
    //     title:'',
    //     text: '¿Desea cambiar el estado del registro seleccionado?',
    //     showCancelButton: true,
    //     confirmButtonText:'Sí',
    //     cancelButtonText:'No',
    //     closeOnConfirm: true,
    //     closeOnCancel: true,
    //     allowEscapeKey: false
    //   },
    //   function(isConfirm){
    //     if (isConfirm) {
    //       rDocument.changeStatus({id:item.id, status:item.status}, function(){
    //         toastr.info('Estado actualizado satisfactoriamente', {
    //           onShown: function () {
    //             loadReturn();
    //           }
    //         });
    //       }, function(){
    //         vm.loading = false;
    //         vm.submitAttempt = false;
    //         toastr.error('Error al cambiar estado');
    //       });
    //     }else{
    //       loadReturn();
    //     }
    //   });
    // }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadReturn();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadReturn();
    }

    function range (n) {
      return new Array(n);
    }

    function searchReturn(){
      vm.pageNum = 1;
      loadReturn();
    }

    returnEdited = $rootScope.$on('returnEdited', function() {
      vm.query.filter = null;
      checkWarehouses();
    });

    $rootScope.$on('$destroy', returnEdited);

  }
})();
