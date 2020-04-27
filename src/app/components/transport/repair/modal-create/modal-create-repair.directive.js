(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateRepair', utnModalCreateRepair);

  /* @ngInject */
  function utnModalCreateRepair() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/repair/modal-create/modal-create-repair.html',
      controller: ModalCreateRepairController,
      controllerAs: 'mCreateRepair',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateRepairController(rRepair, rTypeDocument, rVehicle, SweetAlert, $rootScope, toastr, authenticationService, moment/*, utilsService*/) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      vm.userConected = userInfo[0].user;
      

      vm.damageDateUI = new Date();
      vm.repairDateUI = new Date();
      vm.detailSelectedIndex = -1;

      vm.newRepair = {amount:0, status:true, user:vm.userConected};
      vm.newRepair.repairsDetail = [];
      vm.repairTypeList = [{id:1, name:'Mecánica General'}, {id:2, name:'Motor'}, {id:3, name:'Caja de Cambios'},
      {id:4, name:'Trasmisión / Embrage'}, {id:5, name:'Dirección'}, {id:6, name:'El sistema eléctrico'},
      {id:7, name:'Frenos y ruedas'}, {id:8, name:'Suspensión'}, {id:9, name:'Electrico'},
      {id:10, name:'Carrocería'}, {id:11, name:'Otro'} ];

      vm.createRepair = createRepair;
      vm.dismissModal = dismissModal;
      vm.searchVehicle = searchVehicle;

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;
      
      function init () {
        //loadTypeRepair();
        getNumberRepair();
        loadVehicle();

        vm.newRepair = {amount:0, status:true, user:vm.userConected};
        vm.newRepair.repairsDetail = [];
      }
      init();

      function getNumberRepair(){
        vm.nextNumberRepair = 1;
        rRepair.query(vm.query, function(result){
          vm.RepairList  = result.records;
          vm.nextNumberRepair += result.totalRecords;
        }, function () {
          toastr.error('Error al obtener datos.');
        });
      }

      // function loadTypeRepair(){
      //   rTypeDocument.query(function(result){
      //     vm.repairTypeList  = result.records;
      //   });
      // }

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

      function getTotal(){
        vm.newRepair.amount = 0;
        angular.forEach(vm.newRepair.repairsDetail, function(item){
          vm.newRepair.amount += item.amount;
        })
      }

      function cleanFormDetail() {
        vm.detailSelectedIndex = -1;
        vm.itemDetail = { amount: 0 };
      }

      function editDetail(index) {
        vm.detailSelectedIndex = index;
        vm.itemDetail = {};

        angular.copy(vm.newRepair.repairsDetail[vm.detailSelectedIndex], vm.itemDetail);
      }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if (vm.itemDetail.repair){
          angular.copy(vm.itemDetail, detailToAdd);

          if (vm.detailSelectedIndex === -1) {
            //var arr = ['product'];
            // if (!utilsService.validateDuplicateList(vm.itemDetail,vm.newRepair.repairsDetail, arr)) {
              vm.newRepair.repairsDetail.push(detailToAdd);
              vm.addAttempt = false;
            // }else{
            //   angular.forEach(vm.newRepair.repairsDetail, function(item){
            //     if(item.product.id == detailToAdd.product.id){
            //     }
            //   });
            //   vm.addAttempt = false;
            // }
          }else{
            vm.newRepair.repairsDetail[vm.detailSelectedIndex] = detailToAdd;
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
        }

        vm.detailSelectedIndex = -1;
        vm.itemDetail = { amount: 0 };
        getTotal();
        //cleanFormDetail();
      }

      function deleteDetail (index) {
        SweetAlert.swal({
            title:'',
            text: '¿Desea eliminar el registro de la lista?',
            showCancelButton: true,
            confirmButtonText:'Sí',
            cancelButtonText:'No',
            closeOnConfirm: true,
            closeOnCancel: true,
            allowEscapeKey: false
          },
          function(isConfirm){
            if (isConfirm) {
              vm.newRepair.repairsDetail.splice(index, 1);
              getTotal();
            }
          }
        );
      }

      function createRepair(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          if(form.$error.min != undefined){
            toastr.error('No se permiten costos en 0');
          }
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newRepair.repairsDetail.length < 1){
          toastr.error('Debe contener al menos un detalle de la reparación');
          vm.loading = false;
          return;
        }

        vm.newRepair.rowSave = [];

        angular.forEach(vm.newRepair.repairsDetail, function(item){
          var row = {};
          row.typeRepair = item.repair.id;
          row.detail = item.observations;
          row.amount = item.amount;
          row.status = 1;
          // row.RepairId = 0;
          vm.newRepair.rowSave.push(row);
        })

        if(vm.damageDateUI){
          vm.newRepair.damageDate = moment(vm.damageDateUI).format('YYYY-MM-DD');
        }

        if(vm.repairDateUI){
          vm.newRepair.repairDate = moment(vm.repairDateUI).format('YYYY-MM-DD');
        }

        if(vm.newRepair.vehicleDup){
          vm.newRepair.VehicleId = vm.newRepair.vehicleDup.id;
        }

        rRepair.save(vm.newRepair, function(){
          vm.loading = true;
          vm.submitAttempt = false;
          toastr.success('Reparación registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.loading = false;
                vm.newRepair = {amount:0, status:true, user:vm.userConected};
                form.$setPristine();
              }else{
                angular.element('#modalCreateRepair').modal('hide');
              }
              $rootScope.$broadcast('repairEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Reparación');
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
              angular.element('#modalCreateRepair').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateRepair').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateRepair').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newRepair = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
