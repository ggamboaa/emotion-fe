(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditRepair', utnModalEditRepair);

  /* @ngInject */
  function utnModalEditRepair() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/repair/modal-edit/modal-edit-repair.html',
      controller: ModalEditRepairController,
      controllerAs: 'mEditRepair',
      bindToController: true,
      scope:{
        selectedRepair: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditRepairController(rRepair, rTypeDocument, rVehicle, SweetAlert, $rootScope, toastr, authenticationService, moment, DATE_ISO_FORMAT/*, utilsService*/) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      vm.userConected = userInfo[0].user;

      vm.dateUI = new Date();
      vm.damageDateUI = new Date();
      vm.repairDateUI = new Date();
      vm.detailSelectedIndex = -1;

      vm.repairTypeList = [{id:1, name:'Mecánica General'}, {id:2, name:'Motor'}, {id:3, name:'Caja de Cambios'},
      {id:4, name:'Trasmisión / Embrage'}, {id:5, name:'Dirección'}, {id:6, name:'El sistema eléctrico'},
      {id:7, name:'Frenos y ruedas'}, {id:8, name:'Suspensión'}, {id:9, name:'Electrico'},
      {id:10, name:'Carrocería'}, {id:11, name:'Otro'} ];

      vm.editRepair = editRepair;
      vm.dismissModal = dismissModal;
      vm.searchVehicle = searchVehicle;
      vm.repairEdited = {};

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;
      vm.repairToEdit = repairToEdit;

      function init () {
        //loadTypeRepair();
        loadVehicle();
      }
      init();

      function repairToEdit(){
        if(vm.selectedRepair){
          rRepair.query({id:vm.selectedRepair.id}, function(result){
            vm.repairEdited  = result;
            vm.repairEdited.repairsDetail = [];

            vm.damageDateUI = moment(vm.repairEdited.damageDate, DATE_ISO_FORMAT).toDate();
            vm.repairDateUI = moment(vm.repairEdited.repairDate, DATE_ISO_FORMAT).toDate();

            vm.repairEdited.vehicleDup = vm.repairEdited.Vehicle;

            vm.repairEdited.status = (vm.repairEdited.status == 1)? true:false;
            vm.repairEdited.amount = 0;
            angular.forEach(vm.repairEdited.Repair_Details, function(item){
              vm.repairEdited.amount += item.amount;
            });

            vm.repairEdited.repairsDetail = [];

            angular.forEach(vm.repairEdited.Repair_Details, function(item){
              var row = {};
              row.id = item.id;
              row.amount = item.amount;
              row.observations = item.detail;
              angular.forEach(vm.repairTypeList, function(list){
                if(list.id == item.typeRepair){
                  row.repair = list;
                }
              });
              vm.repairEdited.repairsDetail.push(row);
            });
            getNumberRepair();
          });
        }
      }

      function getNumberRepair(){
        vm.nextNumberRepair = vm.repairEdited.id;
        // rRepair.query(vm.query, function(result){
        //   vm.repairList  = result.records;
        //   vm.nextNumberRepair += result.totalRecords;
        // }, function () {
        //   toastr.error('Error al obtener datos.');
        // });
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
        vm.repairEdited.amount = 0;
        angular.forEach(vm.repairEdited.repairsDetail, function(item){
          vm.repairEdited.amount += item.amount;
        })
      }

      function cleanFormDetail() {
        vm.detailSelectedIndex = -1;
        vm.itemDetail = { amount: 0 };
      }

      function editDetail(index) {
        vm.detailSelectedIndex = index;
        vm.itemDetail = {};

        angular.copy(vm.repairEdited.repairsDetail[vm.detailSelectedIndex], vm.itemDetail);
      }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if (vm.itemDetail.repair){
          angular.copy(vm.itemDetail, detailToAdd);

          if (vm.detailSelectedIndex === -1) {
            //var arr = ['product'];
            // if (!utilsService.validateDuplicateList(vm.itemDetail,vm.repairEdited.repairsDetail, arr)) {
              vm.repairEdited.repairsDetail.push(detailToAdd);
              vm.addAttempt = false;
            // }else{
            //   angular.forEach(vm.repairEdited.repairsDetail, function(item){
            //     if(item.product.id == detailToAdd.product.id){
            //     }
            //   });
            //   vm.addAttempt = false;
            // }
          }else{
            vm.repairEdited.repairsDetail[vm.detailSelectedIndex] = detailToAdd;
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
              if(vm.repairEdited.repairsDetail.length == 1){
                toastr.error('La reparación debe contener al menos un detalle');
                getTotal();
              }
              else{
                vm.repairEdited.repairsDetail.splice(index, 1);
              }
              // vm.repairEdited.repairsDetail.splice(index, 1);
              // getTotal();
            }
          }
        );
      }

      function editRepair(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        vm.repairEdited.rowUpdate = [];
        vm.repairEdited.rowSave = [];
        vm.repairEdited.rowDelete = [];

        ///HA EDITADO ALGO?
        angular.forEach(vm.repairEdited.repairsDetail, function(item){
          angular.forEach(vm.repairEdited.Repair_Details, function(db){
            if(db.id == item.id){
              if(db.amount != item.amount || db.detail != item.observations || db.typeRepair != item.repair.id){
                var row = {};
                row.id = item.id;
                row.typeRepair = item.repair.id;
                row.detail = item.observations;
                row.amount = item.amount;
                row.status = 1;
                vm.repairEdited.rowUpdate.push(row);
              }
            }
          })
        })

        ///HA AGREGADO NUEVOS DATOS
        angular.forEach(vm.repairEdited.repairsDetail, function(item){
          var flag = false;
          angular.forEach(vm.repairEdited.Repair_Details, function(db){
            if(db.id == item.id){
              flag = true;
            }
          })
          if(!flag){
            var row = {};
            row.typeRepair = item.repair.id;
            row.detail = item.observations;
            row.amount = item.amount;
            row.status = 1;
            row.RepairId = vm.repairEdited.id;
            vm.repairEdited.rowSave.push(row);
          }
        })

        ///HA ELIMINADO
        angular.forEach(vm.repairEdited.Repair_Details, function(db){
          var flag = false;
          angular.forEach(vm.repairEdited.repairsDetail, function(item){
            if(db.id == item.id){
              flag = true;
            }
          })
          if(!flag){
            var row = {};
            row.id = db.id;
            vm.repairEdited.rowDelete.push(row);
          }
        })

        ////CONTINUAMOS
        if(vm.repairEdited.rowDelete < 1 && vm.repairEdited.rowSave < 1 && vm.repairEdited.rowUpdate < 1){
          toastr.error('No ha realizado ningún Cambio');
          vm.loading = false;
          return;
        }

        // vm.repairEdited.newIds = [];
        // angular.forEach(vm.repairEdited.repairsDetail, function(item){
        //   vm.repairEdited.newIds.push(item.repair.id);
        // })

        // if(vm.dateUI){
        //   vm.repairEdited.date = moment(vm.dateUI).format('YYYY-MM-DD');
        // }

        // if(vm.repairEdited.vehicleDup){
        //   vm.repairEdited.VehicleId = vm.repairEdited.vehicleDup.id;
        // }

        rRepair.update(vm.repairEdited, function(){
          vm.loading = true;
          vm.submitAttempt = false;
          toastr.success('Reparación actualizada satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditRepair').modal('hide');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al editar Reparación');
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
              angular.element('#modalEditRepair').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditRepair').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditRepair').on('shown.bs.modal', function(){
        repairToEdit();
      });

      angular.element('#modalEditRepair').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.repairToEdit = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
