(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateAdminVehicle', utnModalCreateAdminVehicle);

  /* @ngInject */
  function utnModalCreateAdminVehicle() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/admin-vehicle/modal-create/modal-create-admin-vehicle.html',
      controller: ModalCreateAdminVehicleController,
      controllerAs: 'mCreateAdminVehicle',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateAdminVehicleController( rVehicle, rAdminVehicle, rWarehouse, rEmployee,
      SweetAlert, $rootScope, toastr, moment, utilsService, authenticationService ) {
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
      vm.newAdminVehicle = {status:true};

      //Object REVIEW
      vm.newAdminVehicle.reviewDetail = {};

      //Objects MILEAGE
      vm.newAdminVehicle.mileageDetailList = [];

      //Objects FUEL
      vm.newAdminVehicle.fuelDetailList = [];

      vm.createAdminVehicle = createAdminVehicle;
      vm.dismissModal = dismissModal;
      vm.searchWarehouse = searchWarehouse;
      vm.searchVehicle = searchVehicle;
      vm.searchEmployee = searchEmployee;
      vm.setNextInitDate = setNextInitDate;
      vm.setFinalDate = setFinalDate;
      vm.deleteDetail = deleteDetail;
      vm.closePanel = closePanel;
      vm.withoutFuelRecord = withoutFuelRecord;
      vm.next = next;

      // vm.editFuelDetail = editFuelDetail;
      vm.addFuelDetail = addFuelDetail;
      // vm.deleteFuelDetail = deleteFuelDetail;
      // vm.cleanFuelFormDetail = cleanFuelFormDetail;
      vm.fuelDetailSelectedIndex = -1;

      function init(){
        vm.newAdminVehicle.status = true;
        vm.newAdminVehicle.mileageDetailList = [];
        vm.newAdminVehicle.fuelDetailList = [];
        vm.newAdminVehicle.reviewDetail = {};
        loadWarehouse();
        loadVehicle();
        loadEmployee();
        setNextInitDate();
        loadDefaultReviews();
        getConsecutive();
        closePanel();
        vm.prueba = false;
      }
      init();

      function next (form) {
        if (!form.$valid){
           vm.submitAttempt = true;
           return
        }

        if(form.$name == 'gasForm'){
          if(vm.newAdminVehicle.fuelDetailList.length == 0){
            vm.loading = false;
            vm.submitAttempt = true;
            vm.tempList = true;
            return;
          }
        }

        vm.submitAttempt = false;
      }

      function getConsecutive(){
        vm.nextNumber = 1;
        rAdminVehicle.query(vm.query, function(result){
          vm.adminVehicleList  = result.records;
          vm.nextNumber += result.totalRecords;
        }, function () {
          toastr.error('Error al obtener datos.');
        });
      }

      function loadDefaultReviews(){
        vm.newAdminVehicle.brakeLevelDup = vm.reviewList[0];
        vm.newAdminVehicle.oilLevelDup = vm.reviewList[0];
        vm.newAdminVehicle.ligthDup = vm.reviewList[0];
        vm.newAdminVehicle.brakeDup = vm.reviewList[0];
        vm.newAdminVehicle.coolantLevelDup = vm.reviewList[0];
        vm.newAdminVehicle.tireConditionDup = vm.reviewList[0];
        vm.newAdminVehicle.oilDup = vm.reviewList[0];
        vm.newAdminVehicle.tirePressureDup = vm.reviewList[0];
        vm.newAdminVehicle.wiperDup = vm.reviewList[0];
        vm.newAdminVehicle.cabinBodyDup = vm.reviewList[0];
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
              vm.newAdminVehicle.fuelDetailList.splice(index, 1);
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
            if (!utilsService.validateDuplicateList(vm.fuelDetail,vm.newAdminVehicle.fuelDetailList, arr)) {
              detailToAdd.date = moment(vm.dateFuelUI).format('YYYY-MM-DD');
              detailToAdd.liter = parseFloat(detailToAdd.liter);
              detailToAdd.cost = parseFloat(detailToAdd.cost);
              detailToAdd.mileage = parseFloat(detailToAdd.mileage);
              vm.newAdminVehicle.fuelDetailList.push(detailToAdd);
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.newAdminVehicle.fuelDetailList, function(item){
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
            vm.newAdminVehicle.fuelDetailList[vm.fuelDetailSelectedIndex] = detailToAdd;
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
          vm.newAdminVehicle.mileageDetailList = [];
          vm.dateEndUI = vm.dateInitUI;
          toastr.error('La Fecha final debe ser mayor o igual a la inicial');
          setMileageDateDetail(0);
        }
        else{
          vm.pdate = moment(vm.dateEndUI).diff(vm.dateInitUI, 'days');
          if(vm.pdate > 31){
            toastr.error('El rango no debe superar 31 días');
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
        vm.newAdminVehicle.mileageDetailList = [];
        vm.date = vm.dateInitUI;

        for (var i = 0; i <= days; i++) {
          var detailDay = {};
          detailDay.day = moment(vm.date).format('YYYY-MM-DD');
          vm.newAdminVehicle.mileageDetailList.push(detailDay);
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
              createAdminVehicle(form,true);
            }
            else{
              vm.loading = false;
              vm.submitAttempt = true;
              vm.prueba = false;
            }
          });
      }

      function createAdminVehicle(form,isNewRequired){
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

        if(vm.newAdminVehicle.fuelDetailList == undefined || vm.newAdminVehicle.fuelDetailList.length < 1){
          if(vm.prueba == false){
            vm.loading = false;
            vm.submitAttempt = true;
            withoutFuelRecord(form);
            return;
          }
        }

        vm.newAdminVehicle.driverEmployeeId = (vm.newAdminVehicle.employeeDup != undefined)?vm.newAdminVehicle.employeeDup.id:"";
        vm.newAdminVehicle.warehouseId = (vm.newAdminVehicle.warehouseDup != undefined)?vm.newAdminVehicle.warehouseDup.id:"";
        vm.newAdminVehicle.vehicleId = (vm.newAdminVehicle.vehicleDup != undefined)?vm.newAdminVehicle.vehicleDup.id:"";
        vm.newAdminVehicle.userId = vm.userConected;
        vm.newAdminVehicle.status = true;


        vm.newAdminVehicle.reviewDetail.brakeLevel = vm.newAdminVehicle.brakeLevelDup.id;
        vm.newAdminVehicle.reviewDetail.oilLevel = vm.newAdminVehicle.oilLevelDup.id;
        vm.newAdminVehicle.reviewDetail.light = vm.newAdminVehicle.ligthDup.id;
        vm.newAdminVehicle.reviewDetail.brake = vm.newAdminVehicle.brakeDup.id;
        vm.newAdminVehicle.reviewDetail.coolantLevel = vm.newAdminVehicle.coolantLevelDup.id;
        vm.newAdminVehicle.reviewDetail.tireCondition = vm.newAdminVehicle.tireConditionDup.id;
        vm.newAdminVehicle.reviewDetail.oil = vm.newAdminVehicle.oilDup.id;
        vm.newAdminVehicle.reviewDetail.tirePressure = vm.newAdminVehicle.tirePressureDup.id;
        vm.newAdminVehicle.reviewDetail.wiper = vm.newAdminVehicle.wiperDup.id;
        vm.newAdminVehicle.reviewDetail.cabinBody = vm.newAdminVehicle.cabinBodyDup.id;
        vm.newAdminVehicle.reviewDetail.commentary = vm.newAdminVehicle.commentary;

        angular.forEach(vm.newAdminVehicle.mileageDetailList, function(item){
          var initTime = moment(item.initDateDup).format("HH:mm:ss.SSS");
          var endTime = moment(item.endDateDup).format("HH:mm:ss.SSS");
          // var newTime = new Date();
          var nowDate = item.day;//moment(newTime).format('YYYY-MM-DD');

          item.initDate = nowDate +"T"+ initTime+"Z";
          item.endDate = nowDate +"T"+ endTime+"Z";

          item.initFuel = (item.initFuelDup != undefined)?item.initFuelDup.name:"";
          item.endFuel = (item.endFuelDup != undefined)?item.endFuelDup.name:"";

        })

        rAdminVehicle.save(vm.newAdminVehicle, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          vm.newAdminVehicle = {status:true};
          // closePanel();
          // loadDefaultReviews();
          // getConsecutive();
          // setFinalDate();
          toastr.success('Gestión registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                init();
                form.$setPristine();
              }else{
                init();
                angular.element('#modalCreateAdminVehicle').modal('hide');
              }
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear la Gestión');
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
              closePanel();
              angular.element('#modalCreateAdminVehicle').modal('hide');
              form.$setPristine();

            }
          }
          );
        }else{
          closePanel();
          angular.element('#modalCreateAdminVehicle').modal('hide');
          form.$setPristine();

        }
      }

      angular.element('#modalCreateAdminVehicle').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        closePanel();
        vm.newAdminVehicle = {};

        init();
      });
    }
  }
})();
