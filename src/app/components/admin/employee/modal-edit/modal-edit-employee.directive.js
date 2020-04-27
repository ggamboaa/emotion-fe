(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalEditEmployee', utnModalEditEmployee);

  /* @ngInject */
  function utnModalEditEmployee() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/employee/modal-edit/modal-edit-employee.html',
      controller: ModalEditEmployeeController,
      controllerAs: 'mEditEmployee',
      bindToController: true,
      scope:{
        selectedEmployee: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditEmployeeController(rEmployee, rDepartment, rWarehouse, rJobPosition, SweetAlert, $rootScope, toastr, moment, utilsService, authenticationService, DATE_ISO_FORMAT, VERIFY_EMAIL) {
      var vm = this;
      
      vm.sexList = [{id:1, name:'Femenino'},{id:2, name:'Masculino'}];
      vm.maritalStatusList = [{id:1, name:'Soltero(a)'}, {id:2, name:'Comprometido(a)'}, {id:3, name:'Casado(a)'}, {id:4, name:'Divorciado(a)'}, {id:5, name:'Viudo(a)'}];

      vm.verifyEmail = VERIFY_EMAIL;
      vm.birthdateUI = new Date();
      vm.detailSelectedIndex = -1;
      
      vm.employeeEdited= {};
      vm.employeeEdited.warehouseDetailList = [];

      vm.cleanFormDetail = cleanFormDetail;
      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;

      vm.searchDepartment = searchDepartment;
      vm.searchWarehouse = searchWarehouse;
      vm.searchJobPosition = searchJobPosition;

      vm.editEmployee = editEmployee;
      vm.dismissModal = dismissModal;

      function init () {
        loadDepartment();
        loadWarehouse();
        loadJobPosition();
      }
      init();

      function employeeToEdit(){
        if(vm.selectedEmployee){
          rEmployee.query({id:vm.selectedEmployee.id}, function(result){
            vm.employeeEdited  = result;

            vm.employeeEdited.warehouseDetailList = [];

            if(vm.employeeEdited.birthdate){
              vm.birthdateUI = moment(vm.employeeEdited.birthdate, DATE_ISO_FORMAT).toDate();
            }

            vm.employeeEdited.status = (vm.employeeEdited.status == 1) ? true:false;
            vm.employeeEdited.sexDup = (vm.employeeEdited.sex == 1) ? vm.sexList[0]:vm.sexList[1];
            
            if( vm.employeeEdited.maritalStatus){
              var action = parseInt( vm.employeeEdited.maritalStatus);
              switch (action) {
                case 1:
                  vm.employeeEdited.maritalStatusDup = vm.maritalStatusList[0];
                  break;
                case 2:
                  vm.employeeEdited.maritalStatusDup = vm.maritalStatusList[1];
                  break;
                case 3:
                  vm.employeeEdited.maritalStatusDup = vm.maritalStatusList[2];
                  break;
                case 4:
                  vm.employeeEdited.maritalStatusDup = vm.maritalStatusList[3];
                  break;
                case 5:
                  vm.employeeEdited.maritalStatusDup = vm.maritalStatusList[4];
                  break;
              }
            }

            angular.forEach(vm.employeeEdited.Warehouses, function(item){
              var obj = {};
              obj.warehouse = {id:item.id, code:item.code, name:item.name}; 
              vm.employeeEdited.warehouseDetailList.push(obj);
              //vm.employeeEdited.warehouseIds.push(item.id);
            });

          });
        }
      }

      function loadDepartment(){
        rDepartment.query(function(result){
          vm.deptList  = result.records;
        });
      }

      function searchDepartment(filter){
        if(filter.search == ''){
          loadDepartment();
        }else{
          vm.query = {filter: filter.search};
          rDepartment.query(vm.query, function (result) {
            vm.deptList = result.records;
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

      function loadJobPosition(){
        rJobPosition.query(function(result){
          vm.jobPositionList  = result.records;
        });
      }

      function searchJobPosition(filter){
        if(filter.search == ''){
          loadJobPosition();
        }else{
          vm.query = {filter: filter.search};
          rJobPosition.query(vm.query, function (result) {
            vm.jobPositionList = result.records;
          });
        }
      }

      function cleanFormDetail() {
        vm.detailSelectedIndex = -1;
        vm.itemDetail = {};
      }

      function editDetail(index) {
        vm.detailSelectedIndex = index;
        vm.itemDetail = {};

        angular.copy(vm.employeeEdited.warehouseDetailList[vm.detailSelectedIndex], vm.itemDetail);
      }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if (vm.itemDetail.warehouse ){
          angular.copy(vm.itemDetail, detailToAdd);

          if (vm.detailSelectedIndex === -1) {
            var arr = ['warehouse'];
            if (!utilsService.validateDuplicateList(vm.itemDetail,vm.employeeEdited.warehouseDetailList, arr)) {
              vm.employeeEdited.warehouseDetailList.push(detailToAdd);
              vm.addAttempt = false;
            }else{
              vm.duplicated = true;
            }
          }else{
            vm.employeeEdited.warehouseDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
        }

        vm.detailSelectedIndex = -1;
        vm.itemDetail = {};
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
              vm.employeeEdited.warehouseDetailList.splice(index, 1);
            }
          }
        );
      }

      function editEmployee(form){
        vm.loading = true;
        vm.submitAttempt = false;
        
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.birthdateUI){
          vm.employeeEdited.birthdate = moment(vm.birthdateUI).format('YYYY-MM-DD');
        }

        if(vm.employeeEdited.warehouse){
          vm.employeeEdited.warehouseId = vm.employeeEdited.warehouse.id; 
        }

        if(vm.employeeEdited.department){
          vm.employeeEdited.departmentId = vm.employeeEdited.department.id; 
        }

        if(vm.employeeEdited.jobPosition){
          vm.employeeEdited.jobPositionId = vm.employeeEdited.jobPosition.id; 
        }

        if(vm.employeeEdited.sexDup){
          vm.employeeEdited.sex = vm.employeeEdited.sexDup.id; 
        }

        if(vm.employeeEdited.maritalStatusDup){
          vm.employeeEdited.maritalStatus = vm.employeeEdited.maritalStatusDup.id; 
        }

        if(vm.employeeEdited.warehouseDetailList.length == 0 && authenticationService.getUserInfo()[0].employeeId == vm.employeeEdited.id){
          authenticationService.getUserInfo()[0].warehouseSelected = null;
          authenticationService.getUserInfo().warehouseList = [];
        }else{
          vm.employeeEdited.warehouseIds = [];
          angular.forEach(vm.employeeEdited.warehouseDetailList, function(item){
            vm.employeeEdited.warehouseIds.push(item.warehouse.id);
          })
        }

        rEmployee.update(vm.employeeEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Empleado actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditEmployee').modal('hide');
              $rootScope.$broadcast('employeeEdited');
            }
          });
        }, function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          toastr.error("Ajuste(s): " + errorMsg, 'Error al editar Empleado');
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
                angular.element('#modalEditEmployee').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalEditEmployee').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditEmployee').on('shown.bs.modal', function(){
        employeeToEdit();
      });

      angular.element('#modalEditEmployee').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.employeeEdited = {};
        init();
      });

    }
  }
})();
