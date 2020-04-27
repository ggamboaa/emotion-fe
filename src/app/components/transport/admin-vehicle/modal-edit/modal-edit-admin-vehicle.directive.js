(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditAdminVehicle', utnModalEditAdminVehicle);

  /* @ngInject */
  function utnModalEditAdminVehicle() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/admin-vehicle/modal-edit/modal-edit-admin-vehicle.html',
      controller: ModalEditAdminVehicleController,
      controllerAs: 'mEditAdminVehicle',
      bindToController: true,
      scope:{
        selectedAdminVehicle: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditAdminVehicleController( rVehicle, rAdminVehicle, rWarehouse, rEmployee,
      SweetAlert, $rootScope, toastr, moment, utilsService, authenticationService, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      vm.userConected = userInfo[0].id;

      vm.dateInitUI = new Date();
      vm.dateEndUI = new Date();
      vm.dateFuelUI = new Date();

      vm.reviewList = [{id:1, name:'Bueno'},{id:2, name:'Malo'}];
      vm.fuelPorcent = [{ name:'10 %'},{ name:'20 %'},{ name:'30%'},{ name:'40 %'},
      { name:'50 %'},{ name:'60 %'},{ name:'70 %'},{ name:'80 %'},{ name:'90 %'},{ name:'100 %'}];

      //object ADMIN_VEHICLE
      vm.adminVehicleEdited = {status:true};

      //Object REVIEW
      vm.adminVehicleEdited.reviewDetail = {};

      //Objects MILEAGE
      vm.adminVehicleEdited.mileageDetailList = [];

      //Objects FUEL
      vm.adminVehicleEdited.fuelDetailList = [];

      vm.editAdminVehicle = editAdminVehicle;
      vm.dismissModal = dismissModal;
      vm.searchWarehouse = searchWarehouse;
      vm.searchVehicle = searchVehicle;
      vm.searchEmployee = searchEmployee;
      vm.setNextInitDate = setNextInitDate;
      vm.setFinalDate = setFinalDate;
      vm.deleteDetail = deleteDetail;
      vm.closePanel = closePanel;
      vm.withoutFuelRecord = withoutFuelRecord;


      // vm.editFuelDetail = editFuelDetail;
      vm.addFuelDetail = addFuelDetail;
      // vm.deleteFuelDetail = deleteFuelDetail;
      // vm.cleanFuelFormDetail = cleanFuelFormDetail;
      vm.fuelDetailSelectedIndex = -1;

      function init(){
        vm.adminVehicleEdited.status = true;
        vm.adminVehicleEdited.mileageDetailList = [];
        vm.adminVehicleEdited.fuelDetailList = [];
        vm.adminVehicleEdited.reviewDetail = {};
        // loadWarehouse();
        // loadVehicle();
        // loadEmployee();
        // setNextInitDate();
        // closePanel();
        vm.prueba = false;
      }
      init();

      function adminVehicleToEdit(){
        if(vm.selectedAdminVehicle){
          rAdminVehicle.query({id: vm.selectedAdminVehicle.id}, function(result){
            vm.adminVehicleEdited = result;

            vm.nextNumber = vm.adminVehicleEdited.id;


            //Vehiculo
            vm.adminVehicleEdited.vehicleDup = vm.adminVehicleEdited.vehicle;

            //Chofer
            angular.forEach(vm.employeeList, function(item){
              if(item.id == vm.adminVehicleEdited.driverEmployeeId){
                vm.adminVehicleEdited.employeeDup = item;
              }
            });

            //Sucursal
            angular.forEach(vm.warehouseList, function(item){
              if(item.id == vm.adminVehicleEdited.warehouseId){
                vm.adminVehicleEdited.warehouseDup = item;
              }
            });

            //Review
            vm.adminVehicleEdited.brakeLevelDup = vm.reviewList[(vm.adminVehicleEdited.Review.brakeLevel == 1)?0:1];
            vm.adminVehicleEdited.oilLevelDup = vm.reviewList[(vm.adminVehicleEdited.Review.oilLevel == 1)?0:1];
            vm.adminVehicleEdited.ligthDup = vm.reviewList[(vm.adminVehicleEdited.Review.light == 1)?0:1];
            vm.adminVehicleEdited.brakeDup = vm.reviewList[(vm.adminVehicleEdited.Review.brake == 1)?0:1];
            vm.adminVehicleEdited.coolantLevelDup = vm.reviewList[(vm.adminVehicleEdited.Review.coolantLevel == 1)?0:1];
            vm.adminVehicleEdited.tireConditionDup = vm.reviewList[(vm.adminVehicleEdited.Review.tireCondition == 1)?0:1];
            vm.adminVehicleEdited.oilDup = vm.reviewList[(vm.adminVehicleEdited.Review.oil == 1)?0:1];
            vm.adminVehicleEdited.tirePressureDup = vm.reviewList[(vm.adminVehicleEdited.Review.tirePressure == 1)?0:1];
            vm.adminVehicleEdited.wiperDup = vm.reviewList[(vm.adminVehicleEdited.Review.wiper == 1)?0:1];
            vm.adminVehicleEdited.cabinBodyDup = vm.reviewList[(vm.adminVehicleEdited.Review.cabinBody == 1)?0:1];
            vm.adminVehicleEdited.commentary = vm.adminVehicleEdited.Review.commentary;

            //Mileage
            vm.adminVehicleEdited.mileageDetailList = [];

            angular.forEach(vm.adminVehicleEdited.Mileages, function(item){
              var myMileage = {};
              myMileage.id = item.id;
              var newDate = moment(item.initDate ,'YYYY-MM-DD HH:mm:ss.SSS').toDate();
              myMileage.day = moment(newDate).format('YYYY-MM-DD');
              myMileage.initMileage = item.initMileage;
              myMileage.initDateDup = moment(item.initDate ,'YYYY-MM-DD HH:mm:ss.SSS').toDate();
              myMileage.endMileage = item.endMileage;
              myMileage.endDateDup= moment(item.endDate ,'YYYY-MM-DD HH:mm:ss.SSS').toDate();//new Date(item.endDate);//moment(item.endDate).format("HH:mm");
              if(item.initFuel != undefined && item.endFuel != undefined){
                angular.forEach(vm.fuelPorcent, function(fuel){
                  if(fuel.name == item.initFuel){
                    myMileage.initFuelDup = fuel;
                  }
                  if(fuel.name == item.endFuel){
                    myMileage.endFuelDup = fuel;
                  }
                });
              }

              vm.adminVehicleEdited.mileageDetailList.push(myMileage);
            });

            //Fuel
            vm.adminVehicleEdited.fuelDetailList = [];

            angular.forEach(vm.adminVehicleEdited.Fuel, function(item){
              var myFuel = {};
              myFuel.id = item.id;
              var newDate = moment(item.date, DATE_ISO_FORMAT).toDate();
              myFuel.date = moment(newDate).format('YYYY-MM-DD');
              myFuel.liter = parseFloat(item.liter);
              myFuel.cost = parseFloat(item.cost);
              myFuel.mileage = parseFloat(item.mileage);

              vm.adminVehicleEdited.fuelDetailList.push(myFuel);
            });




            // vm.dateInitUI = moment(vm.adminVehicleEdited.birthdate, DATE_ISO_FORMAT).toDate();
          });
        }
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
              vm.adminVehicleEdited.fuelDetailList.splice(index, 1);
            }
          }
        );
      }

      function addFuelDetail(){
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if ( vm.fuelDetail.liter && vm.fuelDetail.cost && vm.fuelDetail.mileage){
          angular.copy(vm.fuelDetail, detailToAdd);

          if (vm.fuelDetailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(vm.fuelDetail,vm.adminVehicleEdited.fuelDetailList, arr)) {
              detailToAdd.date = moment(vm.dateFuelUI).format('YYYY-MM-DD');
              detailToAdd.liter = parseFloat(detailToAdd.liter);
              detailToAdd.cost = parseFloat(detailToAdd.cost);
              detailToAdd.mileage = parseFloat(detailToAdd.mileage);
              vm.adminVehicleEdited.fuelDetailList.push(detailToAdd);
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.adminVehicleEdited.fuelDetailList, function(item){
                if(item.fuelDetail.liter == detailToAdd.product.liter){
                  detailToAdd.date = moment(vm.dateFuelUI).format('YYYY-MM-DD');
                  detailToAdd.liter = parseFloat(detailToAdd.liter);
                  detailToAdd.cost = parseFloat(detailToAdd.cost);
                  detailToAdd.mileage = parseFloat(detailToAdd.mileage)
                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.date = moment(vm.dateFuelUI).format('YYYY-MM-DD');
            detailToAdd.liter = parseFloat(detailToAdd.liter);
            detailToAdd.cost = parseFloat(detailToAdd.cost);
            detailToAdd.mileage = parseFloat(detailToAdd.mileage)
            vm.adminVehicleEdited.fuelDetailList[vm.fuelDetailSelectedIndex] = detailToAdd;
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
        }

        vm.detailSelectedIndex = -1;
        vm.fuelDetail = {};
        //cleanFormDetail();
      }

      function setFinalDate(){
        vm.pInicio = moment(vm.dateInitUI).format('YYYY-MM-DD');
        vm.pFinal = moment(vm.dateEndUI).format('YYYY-MM-DD');
        if (moment(vm.dateInitUI).format('YYYY-MM-DD') > moment(vm.dateEndUI).format('YYYY-MM-DD')) {
          vm.adminVehicleEdited.mileageDetailList = [];
          vm.dateEndUI = vm.dateInitUI;
          toastr.warning('La Fecha final debe ser mayor o igual a la inicial');
          setMileageDateDetail(0);
        }
        else{
          vm.pdate = moment(vm.dateEndUI).diff(vm.dateInitUI, 'days');
          if(vm.pdate > 31){
            toastr.warning('El rango no debe superar 31 días');
          }
          else{
            setMileageDateDetail(vm.pdate);
          }
        }
      }


      function setNextInitDate(){
        vm.dateEndUI = vm.dateInitUI;
        vm.dateEndUI = moment(vm.dateEndUI).add(6, 'd');
        vm.dateEndUI = moment(vm.dateEndUI._d).toDate();

        setMileageDateDetail(6);
      }

      function setMileageDateDetail(pday){
        var days = pday;
        vm.adminVehicleEdited.mileageDetailList = [];
        vm.date = vm.dateInitUI;

        for (var i = 0; i <= days; i++) {
          var detailDay = {};
          detailDay.day = moment(vm.date).format('YYYY-MM-DD');
          vm.adminVehicleEdited.mileageDetailList.push(detailDay);
          vm.date = moment(vm.date).add(1, 'd');
        }
      }

      function loadEmployee(){
        rEmployee.query(function(result){
          vm.employeeList  = result.records;
        });
      }

      function searchEmployee(filter){
        if(filter.search == ''){
          loadEmployee();
        }else{
          vm.query = {filter: filter.search};
          rEmployee.query(vm.query, function (result) {
            vm.employeeList = result.records;
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

      function loadWarehouse(){
        rWarehouse.query(function(result){
          vm.warehouseList  = result.records;
        });
      }

      function searchWarehouse(filter){
        if(filter.search == ''){
          loadWarehouse();
        }else{
          vm.query = {filter: filter.search};
          rWarehouse.query(vm.query, function (result) {
            vm.warehouseList = result.records;
          });
        }
      }

      function withoutFuelRecord(form){
        vm.prueba = true;
        SweetAlert.swal({
            title:'',
            text: '¿Esta seguro de guardar sin Registros de Recargas de Combustible?',
            showCancelButton: true,
            confirmButtonText:'Sí',
            cancelButtonText:'No',
            closeOnConfirm: true,
            closeOnCancel: true,
            allowEscapeKey: false
          },
          function(isConfirm){
            if (isConfirm) {
              form.$valid = true;
              editAdminVehicle(form,true);
            }
            else{
              vm.loading = false;
              vm.submitAttempt = true;
              vm.prueba = false;
            }
          });
      }

      function editAdminVehicle(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          toastr.error('Complete los campos Requeridos por favor')
          vm.panelHead = true;
          vm.panelReview = true;
          vm.panelMileage = true;
          vm.panelFuel = true;
          return;
        }

        // if(vm.adminVehicleEdited.fuelDetailList == undefined || vm.adminVehicleEdited.fuelDetailList.length < 1){
        //   if(vm.prueba == false){
        //     vm.loading = false;
        //     vm.submitAttempt = true;
        //     withoutFuelRecord(form);
        //     return;
        //   }
        // }

        // vm.adminVehicleEdited.driverEmployeeId = (vm.adminVehicleEdited.employeeDup != undefined)?vm.adminVehicleEdited.employeeDup.id:"";
        // vm.adminVehicleEdited.warehouseId = (vm.adminVehicleEdited.warehouseDup != undefined)?vm.adminVehicleEdited.warehouseDup.id:"";
        // vm.adminVehicleEdited.date = moment(vm.dateInitUI).format('YYYY-MM-DD');
        // vm.adminVehicleEdited.vehicleId = (vm.adminVehicleEdited.vehicleDup != undefined)?vm.adminVehicleEdited.vehicleDup.id:"";
        // vm.adminVehicleEdited.userId = vm.userConected;
        // vm.adminVehicleEdited.status = true;

        //REVIEW OBJECT
        vm.adminVehicleEdited.reviewDetail = {};

        vm.adminVehicleEdited.reviewDetail.brakeLevel = vm.adminVehicleEdited.brakeLevelDup.id;
        vm.adminVehicleEdited.reviewDetail.oilLevel = vm.adminVehicleEdited.oilLevelDup.id;
        vm.adminVehicleEdited.reviewDetail.light = vm.adminVehicleEdited.ligthDup.id;
        vm.adminVehicleEdited.reviewDetail.brake = vm.adminVehicleEdited.brakeDup.id;
        vm.adminVehicleEdited.reviewDetail.coolantLevel = vm.adminVehicleEdited.coolantLevelDup.id;
        vm.adminVehicleEdited.reviewDetail.tireCondition = vm.adminVehicleEdited.tireConditionDup.id;
        vm.adminVehicleEdited.reviewDetail.oil = vm.adminVehicleEdited.oilDup.id;
        vm.adminVehicleEdited.reviewDetail.tirePressure = vm.adminVehicleEdited.tirePressureDup.id;
        vm.adminVehicleEdited.reviewDetail.wiper = vm.adminVehicleEdited.wiperDup.id;
        vm.adminVehicleEdited.reviewDetail.cabinBody = vm.adminVehicleEdited.cabinBodyDup.id;
        vm.adminVehicleEdited.reviewDetail.commentary = vm.adminVehicleEdited.commentary;

        //REVIEWUPDATE
        vm.adminVehicleEdited.reviewUpdate = false;
        if(vm.adminVehicleEdited.reviewDetail.brakeLevel != vm.adminVehicleEdited.Review.brakeLevel ||
          vm.adminVehicleEdited.reviewDetail.oilLevel != vm.adminVehicleEdited.Review.oilLevel ||
          vm.adminVehicleEdited.reviewDetail.light != vm.adminVehicleEdited.Review.light ||
          vm.adminVehicleEdited.reviewDetail.brake != vm.adminVehicleEdited.Review.brake ||
          vm.adminVehicleEdited.reviewDetail.coolantLevel != vm.adminVehicleEdited.Review.coolantLevel ||
          vm.adminVehicleEdited.reviewDetail.tireCondition != vm.adminVehicleEdited.Review.tireCondition ||
          vm.adminVehicleEdited.reviewDetail.oil != vm.adminVehicleEdited.Review.oil ||
          vm.adminVehicleEdited.reviewDetail.tirePressure != vm.adminVehicleEdited.Review.tirePressure ||
          vm.adminVehicleEdited.reviewDetail.wiper != vm.adminVehicleEdited.Review.wiper ||
          vm.adminVehicleEdited.reviewDetail.cabinBody != vm.adminVehicleEdited.Review.cabinBody ||
          vm.adminVehicleEdited.reviewDetail.commentary != vm.adminVehicleEdited.Review.commentary){
          vm.adminVehicleEdited.reviewUpdate = true;
        }

        angular.forEach(vm.adminVehicleEdited.mileageDetailList, function(item){
          var initTime = moment(item.initDateDup).format("HH:mm:ss.SSS");
          var endTime = moment(item.endDateDup).format("HH:mm:ss.SSS");
          // var newTime = new Date();
          var nowDate = item.day;//moment(newTime).format('YYYY-MM-DD');

          item.initDate = nowDate +"T"+ initTime+"Z";
          item.endDate = nowDate +"T"+ endTime+"Z";

          item.initFuel = (item.initFuelDup != undefined)?item.initFuelDup.name:"";
          item.endFuel = (item.endFuelDup != undefined)?item.endFuelDup.name:"";
        })
        //MileageUpdate
        vm.adminVehicleEdited.mileageUpdate = false;

        angular.forEach(vm.adminVehicleEdited.mileageDetailList,function(item){
          angular.forEach(vm.adminVehicleEdited.Mileages, function(dbMileage){
            if(item.id == dbMileage.id){
              if(item.initMileage != dbMileage.initMileage ||
                item.endMileage != dbMileage.endMileage ||
                item.initDate != dbMileage.initDate ||
                item.endDate != dbMileage.endDate ||
                item.initFuel != dbMileage.initFuel ||
                item.endFuel != dbMileage.endFuel){
                vm.adminVehicleEdited.mileageUpdate = true;
              }
            }
          })
        });

        //FuelUpdate
        vm.adminVehicleEdited.fuelUpdate = false;

        if(vm.adminVehicleEdited.Fuel.length > 0){
          angular.forEach(vm.adminVehicleEdited.fuelDetailList, function(item){
            angular.forEach(vm.adminVehicleEdited.Fuel, function(dbFuel){
              if(item.id == dbFuel.id){
                if(item.liter != dbFuel.liter ||
                  item.cost != dbFuel.cost ||
                  item.mileage != dbFuel.mileage){
                  vm.adminVehicleEdited.fuelUpdate = true;
                }
              }
            })
          });
        }

        if(vm.adminVehicleEdited.Fuel.length < vm.adminVehicleEdited.fuelDetailList.length){
          vm.adminVehicleEdited.fuelUpdate = true;
        }

        ///Edit is TRUE
        if(vm.adminVehicleEdited.mileageUpdate == false && vm.adminVehicleEdited.reviewUpdate == false &&
          vm.adminVehicleEdited.fuelUpdate == false){
          vm.loading = false;
          vm.submitAttempt = true;
          toastr.error('No se ha realizado ningún cambio')
          return;
        }

        rAdminVehicle.update(vm.adminVehicleEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.adminVehicleEdited = {status:true};
          toastr.success('Gestión actualizada satisfactoriamente', {
            onShown: function(){
              init();
              angular.element('#modalEditAdminVehicle').modal('hide');
              $rootScope.$broadcast('adminVehicleEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al actualizar la Gestión');
        });
      }

      function closePanel(){
        vm.panelHead = false;
        vm.panelReview = false;
        vm.panelMileage = false;
        vm.panelFuel = false;
        vm.prueba = false;
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
              angular.element('#modalEditAdminVehicle').modal('hide');
              form.$setPristine();
              closePanel();
            }
          }
          );
        }else{
          angular.element('#modalEditAdminVehicle').modal('hide');
          form.$setPristine();
          closePanel();
        }
      }

      angular.element('#modalEditAdminVehicle').on('shown.bs.modal', function(){
        adminVehicleToEdit();
      });

      angular.element('#modalEditAdminVehicle').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        closePanel();
        vm.adminVehicleEdited = {};

        init();
      });
    }
  }
})();
