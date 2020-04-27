(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditReservation', utnModalEditReservation);

  /* @ngInject */
  function utnModalEditReservation() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/reservation/modal-edit/modal-edit-reservation.html',
      controller: ModalEditReservationController,
      controllerAs: 'mEditReservation',
      bindToController: true,
      scope:{
        selectedReservation: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditReservationController(rReservation, rVehicle, rEmployee, SweetAlert, $rootScope, toastr, authenticationService, moment, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      
      vm.dateUI = new Date()
      vm.startDateUI = new Date()
      vm.endDateUI = new Date()

      vm.reservationEdited= {status:true};

      vm.editReservation = editReservation;
      vm.searchVehicle = searchVehicle;
      vm.searchEmployee = searchEmployee;
      vm.dismissModal = dismissModal;
      
      function init () {
        loadVehicle();
        loadEmployee();

        vm.reservationEditedstatus = true;
        vm.reservationEditeduser = vm.userConected.user;
      }
      init();

      function reservationToEdit(){
        if(vm.selectedReservation){
          rReservation.query({id:vm.selectedReservation.id}, function(result){
            vm.reservationEdited  = result;
            
            vm.dateUI = moment(vm.reservationEdited.date, DATE_ISO_FORMAT).toDate();
            vm.startDateUI = moment(vm.reservationEdited.startDate, DATE_ISO_FORMAT).toDate();
            vm.endDateUI = moment(vm.reservationEdited.endDate, DATE_ISO_FORMAT).toDate();
           
          });
        }
      }

      function loadVehicle(){
        rVehicle.query(function(result){
          vm.vehicleList  = result.records;
        });
      }

      function searchVehicle(filter){
        if(filter.search == ''){
          loadVehicle();
        }else{
          vm.query = {filter: filter.search};
          rVehicle.query(vm.query, function (result) {
            vm.vehicleList = result.records;
          });
        }
      }

      function loadEmployee(){
        rEmployee.query(function(result){
          vm.employeeList  = result.records;
        });
      }

      function searchEmployee(filter){
        if(filter.search == ''){
          loadVehicle();
        }else{
          vm.query = {filter: filter.search};
          rEmployee.query(vm.query, function (result) {
            vm.employeeList = result.records;
          });
        }
      }

      function editReservation(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.startDateUI > vm.endDateUI) {
          vm.loading = false;
          vm.submitAttempt = true;
          toastr.error("Fecha Salida debe ser inferior a Fecha Entrega", 'Error al crear Reservación');
          return;
        }

        if(vm.dateUI){
          vm.reservationEdited.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }
        if(vm.startDateUI){
          vm.reservationEdited.startDate = moment(vm.startDateUI).format('YYYY-MM-DD');
          vm.reservationEdited.startDate = vm.reservationEdited.startDate + 'T00:00:00.127Z';
        }
        if(vm.endDateUI){
          vm.reservationEdited.endDate = moment(vm.endDateUI).format('YYYY-MM-DD');
          vm.reservationEdited.endDate = vm.reservationEdited.endDate + 'T00:00:00.127Z';
        }
        if(vm.reservationEdited.employee){
          vm.reservationEdited.employeeId = vm.reservationEdited.employee.id;
        }
        if(vm.reservationEdited.vehicle){
          vm.reservationEdited.vehicleId = vm.reservationEdited.vehicle.id;
        }

        rReservation.update(vm.reservationEdited, function(result){
          if(result.id){
            vm.loading = true;
            vm.submitAttempt = false;
            toastr.success('Reservación actualizada satisfactoriamente', {
              onShown: function(){
                angular.element('#modalEditReservation').modal('hide');
                $rootScope.$broadcast('reservationEdited');
              }
            });
          }else{
            vm.loading = false;
            toastr.error("Vehículo reservado para esta fecha.", 'Error al editar Reservación');
          }
        },
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Reservación');
        });
      }

      function dismissModal (form){
        if(!form.$pristine) {
          SweetAlert.swal({
            title:'',
            text: '¿Esta seguro de salir sin guardar?',
            showCancelButton: true,
            confirmButtonText:'Sí',
            cancelButtonText:'No',
            closeOnConfirm: true,
            closeOnCancel: true,
            allowEscapeKey: false
          },
          function(isConfirm){
            if (isConfirm) {
              angular.element('#modalEditReservation').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditReservation').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditReservation').on('shown.bs.modal', function(){
        reservationToEdit();
      });

      angular.element('#modalEditReservation').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.reservationEdited= {};
        init();
      });

    }
  }
})();
