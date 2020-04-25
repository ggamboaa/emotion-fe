(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateVehicle', utnModalCreateVehicle);

  /* @ngInject */
  function utnModalCreateVehicle() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/vehicle/modal-create/modal-create-vehicle.html',
      controller: ModalCreateVehicleController,
      controllerAs: 'mCreateVehicle',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateVehicleController(rVehicle, SweetAlert, $rootScope, toastr) {
      var vm = this;

      vm.status = true;
      vm.newVehicle = {status:true};

      vm.vehicleTypeList = [{id:1, code:'PART', name:'Particular'}, {id:2, code:'CL', name:'Carga Liviana'}, {id:3, code:'CP', name:'Carga Pesada'}, {id:4, code:'MOT', name:'Moto'}];
      vm.fuelTypeList = [{id:1, name:'Gasolina'}, {id:2, name:'Diesel'}, {id:3, name:'Híbrido'}, {id:4, name:'Eléctrico'}];
      vm.transmissionList = [{id:1, name:'Manual'}, {id:2, name:'Automática'}];

      vm.dismissModal = dismissModal;
      vm.createVehicle = createVehicle;

      function init () {
        vm.newVehicle.status = true;
        loadVehicles();
        loadVehicleYears();
      }
      init();

      function loadVehicleYears(){
        vm.modelList = [];
        vm.date = new Date();
        var end = vm.date.getFullYear();
        var start = vm.date.getFullYear() - 40;
        for(var i=start; i<=end; i++) {
          vm.modelList.push({year: i });
        }
      }

      function loadVehicles(){
        rVehicle.query(function(result){
          vm.vehicleList  = result.records;
        });
      }

      function createVehicle(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newVehicle.model){
          vm.newVehicle.model = vm.newVehicle.model.year;
        }

        if(vm.newVehicle.fuelTypeDup){
          vm.newVehicle.fuelType = vm.newVehicle.fuelTypeDup.id;
        }

        if(vm.newVehicle.transmissionTypeDup){
          vm.newVehicle.transmissionType = vm.newVehicle.transmissionTypeDup.id;
        }

        if(vm.newVehicle.vehicleTypeDup){
          vm.newVehicle.vehicleType = vm.newVehicle.vehicleTypeDup.id;
        }

        rVehicle.save(vm.newVehicle, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Vehículo registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newVehicle = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateVehicle').modal('hide');
              }
              $rootScope.$broadcast('vehicleEdited');
            }
          });
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Vehículo');
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
              vm.newVehicle = {};
              angular.element('#modalCreateVehicle').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateVehicle').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateVehicle').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newVehicle = {};
        init();
      });
    }
  }
})();
