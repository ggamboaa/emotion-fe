(function() {
  'use strict';

  angular
  .module('utn')
  .controller('BrandController', BrandController);

  /** @ngInject */
  function BrandController(rBrand, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG) {
    var vm = this,
    brandEdited;

    vm.query = {};
    vm.newBrand = {};

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

    vm.searchBrand = searchBrand;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadBrand = loadBrand;
    vm.createBrand = createBrand;
    vm.editBrand = editBrand;
    vm.deleteBrand = deleteBrand;
    vm.updateStatus = updateStatus;

    function init () {
      loadBrand(vm.sort, vm.direction);
    }
    init();

    function loadBrand(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'brand-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rBrand.query(vm.query, function(result){
        vm.brandList  = result.records;

        angular.forEach(vm.brandList, function(item){
          if(item.status == '1'){
            item.status = true;
          }
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'brand-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'brand-overlay'});
      });
    }

    function createBrand(){
      angular.element('#modalCreateBrand').modal({backdrop: 'static', keyboard: false});
    }

    function editBrand(brand){
      vm.selectedBrand = brand;
      angular.element('#modalEditBrand').modal({backdrop: 'static', keyboard: false});
    }

    function deleteBrand(item){
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
          rBrand.delete({id:item.id}, function () {
            toastr.info('Marca eliminada satisfactoriamente', {
              onShown: function () {
                loadBrand();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Marca');
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
            rBrand.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Estado actualizado satisfactoriamente', {
                onShown: function () {
                  loadBrand();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadBrand();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadBrand();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadBrand();
    }

    function range (n) {
      return new Array(n);
    }

    function searchBrand(){
      vm.pageNum = 1;
      loadBrand();
    }

    brandEdited = $rootScope.$on('brandEdited', function() {
      vm.query.filter = null;
      loadBrand();
    });

    $rootScope.$on('$destroy', brandEdited);

  }
})();
