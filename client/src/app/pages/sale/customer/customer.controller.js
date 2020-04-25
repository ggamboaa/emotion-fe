(function() {
  'use strict';

  angular
  .module('utn')
  .controller('CustomerController', CustomerController);

  /** @ngInject */
  function CustomerController(rCustomer, rReport, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    customerEdited;

    vm.query = {};
    vm.newCustomer = {};

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

    vm.searchCustomer = searchCustomer;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadCustomer = loadCustomer;
    vm.createCustomer = createCustomer;
    vm.editCustomer = editCustomer;
    vm.deleteCustomer = deleteCustomer;
    vm.updateStatus = updateStatus;
    vm.openReport = openReport;

    function init () {
      loadCustomer(vm.sort, vm.direction);
    }
    init();

    function loadCustomer(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'customer-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rCustomer.query(vm.query, function(result){
        vm.customerList  = result.records;

        angular.forEach(vm.customerList, function(item){
          if(item.status == 1){
            item.status = true;
          }

          item.typeCustomerName = (item.typeCustomer == 1)? "Normal":"Mayoreo";

        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'customer-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'customer-overlay'});
      });
    }

    function createCustomer(){
      angular.element('#modalCreateCustomer').modal({backdrop: 'static', keyboard: false});
    }

    function editCustomer(customer){
      vm.selectedCustomer = customer;
      angular.element('#modalEditCustomer').modal({backdrop: 'static', keyboard: false});
    }

    function deleteCustomer(item){
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
          rCustomer.delete({id:item.id}, function () {
            toastr.info('Cliente eliminado satisfactoriamente', {
              onShown: function () {
                loadCustomer();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Cliente');
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
            rCustomer.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadCustomer();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadCustomer();
          }
        }
      );
    }

    function openReport(){
      vm.query = {};
      rReport.getCustomerReport(vm.query, function(){
        toastr.info('Reporte generado satisfactoriamente. Guardado en: EMOTION/server/pdf');
      },function () {
        toastr.error('Error al obtener reporte.');
      });
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadCustomer();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadCustomer();
    }

    function range (n) {
      return new Array(n);
    }

    function searchCustomer(){
      vm.pageNum = 1;
      loadCustomer();
    }

    customerEdited = $rootScope.$on('customerEdited', function() {
      vm.query.filter = null;
      loadCustomer();
    });

    $rootScope.$on('$destroy', customerEdited);

  }
})();
