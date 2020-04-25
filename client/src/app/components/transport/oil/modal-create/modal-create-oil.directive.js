(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateOil', utnModalCreateOil);

  /* @ngInject */
  function utnModalCreateOil() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/oil/modal-create/modal-create-oil.html',
      controller: ModalCreateOilController,
      controllerAs: 'mCreateOil',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateOilController(rOil, rVehicle, SweetAlert, $rootScope, moment, toastr) {
      var vm = this;

      vm.status = true;
      vm.newOil = {status:true};
      vm.oilList = [{id:1, name:'CASTROL'},{id:2, name:'PENNZOIL'},
      {id:3, name:'MOBIL 1'},{id:4, name:'AMSOIL'},{id:5, name:'REPSOL'},{id:6, name:'TOTAL'},{id:7, name:'VALVOLINE'},{id:8, name:'OTRO'}];

      vm.dismissModal = dismissModal;
      vm.createOil = createOil;

      vm.searchVehicle = searchVehicle;
      vm.dateUI = new Date();

      function init () {
        vm.newOil.status = true;
        loadVehicle();
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


      function createOil(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newOil.typeOilDup){
          vm.newOil.typeOil = vm.newOil.typeOilDup.id;
        }

        if(vm.newOil.vehicleDup){
          vm.newOil.VehicleId = vm.newOil.vehicleDup.id;
        }

        if(vm.dateUI){
          vm.newOil.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }

        rOil.save(vm.newOil, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Cambio de aceite registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newOil = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateOil').modal('hide');
              }
              $rootScope.$broadcast('oilEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Cambio de aceite');
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
              vm.newOil = {};
              angular.element('#modalCreateOil').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateOil').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateOil').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newOil = {};
        init();
      });
    }
  }
})();
