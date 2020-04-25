(function() {
  'use strict';

  angular
  .module('utn')
  .controller('ReservationController', ReservationController);

  /** @ngInject */
  function ReservationController(rReservation, rEmployee, rVehicle, $log, $rootScope, SweetAlert, bsLoadingOverlayService, toastr, PAGINATION_CONFIG, DATE_ISO_FORMAT, moment) {
    var vm = this,
    reservationEdited;

    vm.query = {};
    vm.selectedReservation = {};

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

    vm.searchReservation = searchReservation;
    vm.goToPage = goToPage;
    vm.range = range;
    vm.setRecordsPerPage = setRecordsPerPage;

    vm.loadReservation = loadReservation;
    vm.createReservation = createReservation;
    vm.editReservation = editReservation;
    vm.deleteReservation = deleteReservation;
    vm.updateStatus = updateStatus;

    function init () {
      loadVehicle();
      loadEmployee();
      loadReservation(vm.sort, vm.direction);
    }
    init();

    function loadReservation(_sort, _direction){
      bsLoadingOverlayService.start({referenceId: 'reservation-overlay'});

      if(_sort){ vm.sort = _sort; }
      vm.query.sort = vm.sort;

      if(_direction){ vm.direction = _direction; }
      vm.query.direction = vm.direction;

      vm.query.pagesize = vm.rangeSelected;
      vm.query.page = vm.pageNum-1;

      rReservation.query(vm.query, function(result){
        vm.reservationList  = result.records;

        angular.forEach(vm.reservationList, function(item){
          item.date = moment(item.date, DATE_ISO_FORMAT).toDate();
          item.startDate = moment(item.startDate, DATE_ISO_FORMAT).toDate();
          item.endDate = moment(item.endDate, DATE_ISO_FORMAT).toDate();
        });

        vm.totalRecords = result.totalRecords;
        vm.numberOfPageRecords = result.numberOfPageRecords;
        vm.totalPages = result.totalPages;
        vm.prevPage = result.previous;
        vm.nextPage = result.next;
        bsLoadingOverlayService.stop({referenceId: 'reservation-overlay'});
      }, function () {
        toastr.error('Error al obtener datos.');
        bsLoadingOverlayService.stop({referenceId: 'reservation-overlay'});
      });
    }

    function loadEmployee(){
      rEmployee.query(function(result){
        vm.employeeList  = result.records;
      });
    }

    function loadVehicle(){
      rVehicle.query(function(result){
        vm.vehicleList  = result.records;
      });
    }

    function createReservation(){
      angular.element('#modalCreateReservation').modal({backdrop: 'static', keyboard: false});
    }

    function editReservation(Reservation){
      vm.selectedReservation = Reservation;
      angular.element('#modalEditReservation').modal({backdrop: 'static', keyboard: false});
    }

    function deleteReservation(item){
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
          rReservation.delete({id:item.id}, function () {
            toastr.info('Reservación eliminada satisfactoriamente', {
              onShown: function () {
                loadReservation();
              }
            });
          }, function(error){
            vm.loading = false;
            vm.submitAttempt = false;
            toastr.error(error.data.message, 'Error al eliminar Reservación');
          });
        }
      }
      );
    }

    function updateStatus(item){
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
            item.status = (item.status == 1)?0:1;
            rReservation.changeStatus({id:item.id, status:item.status}, function(){
              toastr.info('Reservación eliminada satisfactoriamente', {
                onShown: function () {
                  loadReservation();
                }
              });
            }, function(){
              vm.loading = false;
              vm.submitAttempt = false;
              toastr.error('Error al cambiar estado');
            });
          }else{
            loadReservation();
          }
        }
      );
    }

    // Pagination Functions
    function setRecordsPerPage (num) {
      vm.rangeSelected = num;
      vm.pageNum = 1;
      loadReservation();
    }

    function goToPage (p) {
      vm.pageNum = p;
      loadReservation();
    }

    function range (n) {
      return new Array(n);
    }

    function searchReservation(){
      vm.pageNum = 1;
      loadReservation();
    }

    reservationEdited = $rootScope.$on('reservationEdited', function() {
      vm.query.filter = null;
      loadReservation();
    });

    $rootScope.$on('$destroy', reservationEdited);

  }
})();
