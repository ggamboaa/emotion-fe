(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditOil', utnModalEditOil);

  /* @ngInject */
  function utnModalEditOil() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/oil/modal-edit/modal-edit-oil.html',
      controller: ModalEditOilController,
      controllerAs: 'mEditOil',
      bindToController: true,
      scope:{
        selectedOil: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditOilController(rOil, rVehicle, SweetAlert, $rootScope, toastr, moment, DATE_ISO_FORMAT) {
      var vm = this;

      vm.status = true;
      vm.oilEdited = {status:true};
      vm.oilList = [{id:1, name:'CASTROL'},{id:2, name:'PENNZOIL'},
      {id:3, name:'MOBIL 1'},{id:4, name:'AMSOIL'},{id:5, name:'REPSOL'},{id:6, name:'TOTAL'},{id:7, name:'VALVOLINE'},{id:8, name:'OTRO'}];

      vm.dismissModal = dismissModal;
      vm.editOil = editOil;

      vm.searchVehicle = searchVehicle;
      vm.dateUI = new Date();

      function init () {
        vm.oilEdited.status = true;
        loadVehicle();
      }
      init();

      function oilToEdit(){
        if(vm.selectedOil){
          rOil.query({id: vm.selectedOil.id}, function(result){
            vm.oilEdited = result;

            vm.dateUI =  moment(vm.oilEdited.date, DATE_ISO_FORMAT).toDate();

            vm.oilEdited.vehicleDup = vm.oilEdited.Vehicle;

            angular.forEach(vm.oilList, function(item){
              if(item.id == vm.oilEdited.typeOil){
                vm.oilEdited.typeOilDup = item;
              }
            })


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


      function editOil(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.oilEdited.typeOilDup){
          vm.oilEdited.typeOil = vm.oilEdited.typeOilDup.id;
        }

        if(vm.oilEdited.vehicleDup){
          vm.oilEdited.VehicleId = vm.oilEdited.vehicleDup.id;
        }

        if(vm.dateUI){
          vm.oilEdited.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }

        rOil.update(vm.oilEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Cambio de aceite actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditOil').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al actualizar Cambio de aceite');
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
              vm.oilEdited = {};
              angular.element('#modalEditOil').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditOil').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditOil').on('shown.bs.modal', function(){
        oilToEdit();
      });


      angular.element('#modalEditOil').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.oilEdited = {};
        init();
      });
    }
  }
})();
