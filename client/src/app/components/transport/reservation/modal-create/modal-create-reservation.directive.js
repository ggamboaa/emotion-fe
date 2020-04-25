(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateReservation', utnModalCreateReservation);

  /* @ngInject */
  function utnModalCreateReservation() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/reservation/modal-create/modal-create-reservation.html',
      controller: ModalCreateReservationController,
      controllerAs: 'mCreateReservation',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateReservationController(rReservation, rVehicle, rEmployee, SweetAlert, $rootScope, toastr, authenticationService, moment) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }
      
      vm.dateUI = new Date();
      vm.startDateUI = new Date();
      vm.endDateUI = new Date();

      vm.newReservation = {status:true};

      vm.createReservation = createReservation;
      vm.searchVehicle = searchVehicle;
      vm.searchEmployee = searchEmployee;
      vm.dismissModal = dismissModal;
      
      function init () {
        loadVehicle();
        loadEmployee();

        vm.newReservation.status = true;
        vm.newReservation.user = vm.userConected.user;
      }
      init();

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

      function createReservation(form,isNewRequired){
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
          vm.newReservation.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }
        if(vm.startDateUI){
          vm.newReservation.startDate = moment(vm.startDateUI).format('YYYY-MM-DD');
          vm.newReservation.startDate = vm.newReservation.startDate + 'T00:00:00.127Z';
        }
        if(vm.endDateUI){
          vm.newReservation.endDate = moment(vm.endDateUI).format('YYYY-MM-DD');
          vm.newReservation.endDate = vm.newReservation.endDate + 'T00:00:00.127Z';
        }
        if(vm.newReservation.employee){
          vm.newReservation.employeeId = vm.newReservation.employee.id;
        }
        if(vm.newReservation.vehicle){
          vm.newReservation.vehicleId = vm.newReservation.vehicle.id;
        }

        rReservation.save(vm.newReservation, function(result){
          if(result.id){
            vm.loading = true;
            vm.submitAttempt = false;
            toastr.success('Reservación registrada satisfactoriamente', {
              onShown: function(){
                if(isNewRequired){
                  vm.loading = false;
                  vm.newReservation = {};
                  form.$setPristine();
                }else{
                  angular.element('#modalCreateReservation').modal('hide');
                }
                $rootScope.$broadcast('reservationEdited');
              }
            });
          }else{
            vm.loading = false;
            toastr.error("Vehículo reservado para esta fecha.", 'Error al crear Reservación');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Reservación');
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
              angular.element('#modalCreateReservation').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateReservation').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateReservation').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newReservation = {};
        vm.dateUI = new Date();
        vm.startDateUI = new Date();
        vm.endDateUI = new Date();
        init();
      });

    }
  }
})();
