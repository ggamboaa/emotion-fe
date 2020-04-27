(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditVehicle', utnModalEditVehicle);

  /* @ngInject */
  function utnModalEditVehicle() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/vehicle/modal-edit/modal-edit-vehicle.html',
      controller: ModalEditVehicleController,
      controllerAs: 'mEditVehicle',
      bindToController: true,
      scope:{
        selectedVehicle: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditVehicleController(rVehicle, SweetAlert, $rootScope, toastr) {
      var vm = this;

      vm.vehicleTypeList = [{id:1, code:'PART', name:'Particular'}, {id:2, code:'CL', name:'Carga Liviana'}, {id:3, code:'CP', name:'Carga Pesada'}, {id:4, code:'MOT', name:'Moto'}];
      vm.fuelTypeList = [{id:1, name:'Gasolina'}, {id:2, name:'Diesel'}, {id:3, name:'Híbrido'}, {id:4, name:'Eléctrico'}];
      vm.transmissionList = [{id:1, name:'Manual'}, {id:2, name:'Automática'}];

      vm.modelList = [];

      vm.dismissModal = dismissModal;
      vm.editVehicle = editVehicle;
      vm.vehicleEdited = {};

      function init(){
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
          vm.modelList.push({model: i });
        }
      }

      function vehicleToEdit(){
        if(vm.selectedVehicle){
          rVehicle.query({id: vm.selectedVehicle.id}, function(result){
            vm.vehicleEdited = result;

            vm.vehicleEdited.status = (vm.vehicleEdited.status == 1)?true:false;
            vm.vehicleEdited.model = {model:vm.vehicleEdited.model};

            var action = '';
            if( vm.vehicleEdited.fuelType){
              action = parseInt( vm.vehicleEdited.fuelType);
              switch (action) {
                case 1:
                  vm.vehicleEdited.fuelTypeDup = vm.fuelTypeList[0];
                  break;
                case 2:
                  vm.vehicleEdited.fuelTypeDup = vm.fuelTypeList[1];
                  break;
                case 3:
                  vm.vehicleEdited.fuelTypeDup = vm.fuelTypeList[2];
                  break;
                case 4:
                  vm.vehicleEdited.fuelTypeDup = vm.fuelTypeList[3];
                  break;
              }
            }

            if( vm.vehicleEdited.transmissionType){
              action = parseInt( vm.vehicleEdited.transmissionType);
              switch (action) {
                case 1:
                  vm.vehicleEdited.transmissionTypeDup = vm.transmissionList[0];
                  break;
                case 2:
                  vm.vehicleEdited.transmissionTypeDup = vm.transmissionList[1];
                  break;
              }
            }

            if( vm.vehicleEdited.vehicleType){
              action = parseInt( vm.vehicleEdited.vehicleType);
              switch (action) {
                case 1:
                  vm.vehicleEdited.vehicleTypeDup = vm.vehicleTypeList[0];
                  break;
                case 2:
                  vm.vehicleEdited.vehicleTypeDup = vm.vehicleTypeList[1];
                  break;
                case 3:
                  vm.vehicleEdited.vehicleTypeDup = vm.vehicleTypeList[2];
                  break;
                case 4:
                  vm.vehicleEdited.vehicleTypeDup = vm.vehicleTypeList[3];
                  break;
              }
            }
          });
        }
      }

      function loadVehicles(){
        rVehicle.query(function(result){
          vm.vehicleList  = result.records;
        });
      }

      function editVehicle(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.vehicleEdited.model){
          vm.vehicleEdited.model = vm.vehicleEdited.model.model;
        }

        if(vm.vehicleEdited.fuelTypeDup){
          vm.vehicleEdited.fuelType = vm.vehicleEdited.fuelTypeDup.id;
        }

        if(vm.vehicleEdited.transmissionTypeDup){
          vm.vehicleEdited.transmissionType = vm.vehicleEdited.transmissionTypeDup.id;
        }

        if(vm.vehicleEdited.vehicleTypeDup){
          vm.vehicleEdited.vehicleType = vm.vehicleEdited.vehicleTypeDup.id;
        }

        rVehicle.update(vm.vehicleEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Vehículo actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditVehicle').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Vehículo');
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
              vm.vehicleEdited = {};
              angular.element('#modalEditVehicle').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditVehicle').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditVehicle').on('shown.bs.modal', function(){
        vehicleToEdit();
      });

      angular.element('#modalEditVehicle').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.vehicleToEdit = {};
        init();
      });

    }
  }
})();
