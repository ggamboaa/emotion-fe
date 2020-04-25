(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalCreateEmployee', utnModalCreateEmployee);

  /* @ngInject */
  function utnModalCreateEmployee() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/admin/employee/modal-create/modal-create-employee.html',
      controller: ModalCreateEmployeeController,
      controllerAs: 'mCreateEmployee',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateEmployeeController(rEmployee, rDepartment, rWarehouse, rJobPosition, SweetAlert, $rootScope, toastr, moment, utilsService, VERIFY_EMAIL) {
      var vm = this;
      vm.status = true;
      vm.newEmployee = {status:true};
      vm.newEmployee.warehouseDetailList = [];

      vm.sexList = [{id:1, name:'Femenino'},{id:2, name:'Masculino'}];
      vm.maritalStatusList = [{id:1, name:'Soltero(a)'}, {id:2, name:'Comprometido(a)'}, {id:3, name:'Casado(a)'}, {id:4, name:'Divorciado(a)'}, {id:5, name:'Viudo(a)'}];

      vm.verifyEmail = VERIFY_EMAIL;
      vm.birthdateUI = new Date();
      vm.detailSelectedIndex = -1;

      vm.cleanFormDetail = cleanFormDetail;
      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;

      vm.searchDepartment = searchDepartment;
      vm.searchWarehouse = searchWarehouse;
      vm.searchJobPosition = searchJobPosition;
      
      vm.createEmployee = createEmployee;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newEmployee.status = true;
        vm.newEmployee.warehouseDetailList = [];
        loadDepartment();
        loadWarehouse();
        loadJobPosition();
      }
      init();

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

        angular.copy(vm.newEmployee.warehouseDetailList[vm.detailSelectedIndex], vm.itemDetail);
      }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        if (vm.itemDetail.warehouse){
          angular.copy(vm.itemDetail, detailToAdd);

          if (vm.detailSelectedIndex === -1) {
            var arr = ['warehouse'];
            if (!utilsService.validateDuplicateList(vm.itemDetail,vm.newEmployee.warehouseDetailList, arr)) {
              vm.newEmployee.warehouseDetailList.push(detailToAdd);
              vm.addAttempt = false;
            }else{
              vm.duplicated = true;
            }
          }else{
            vm.newEmployee.warehouseDetailList[vm.detailSelectedIndex] = detailToAdd;
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
              vm.newEmployee.warehouseDetailList.splice(index, 1);
            }
          }
        );
      }

      function createEmployee(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;
        
        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.birthdateUI){
          vm.newEmployee.birthdate = moment(vm.birthdateUI).format('YYYY-MM-DD');
        }

        if(vm.newEmployee.warehouse){
          vm.newEmployee.warehouseId = vm.newEmployee.warehouse.id; 
        }

        if(vm.newEmployee.department){
          vm.newEmployee.departmentId = vm.newEmployee.department.id; 
        }

        if(vm.newEmployee.jobPosition){
          vm.newEmployee.jobPositionId = vm.newEmployee.jobPosition.id; 
        }

        if(vm.newEmployee.sexDup){
          vm.newEmployee.sex = vm.newEmployee.sexDup.id; 
        }

        if(vm.newEmployee.maritalStatusDup){
          vm.newEmployee.maritalStatus = vm.newEmployee.maritalStatusDup.id; 
        }

        if(vm.newEmployee.warehouseDetailList.length == 0){
          toastr.error('Empleado debe estar asociado al menos a una Sucursal');
          vm.loading = false;
          return;
        }

        vm.newEmployee.warehouseIds = [];
        angular.forEach(vm.newEmployee.warehouseDetailList, function(item){
          vm.newEmployee.warehouseIds.push(item.warehouse.id);
        })

        rEmployee.save(vm.newEmployee, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Empleado registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newEmployee = {status: true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateEmployee').modal('hide');
              }
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
          toastr.error("Ajuste(s): " + errorMsg, 'Error al crear Empleado');
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
                angular.element('#modalCreateEmployee').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalCreateEmployee').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateEmployee').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.newEmployee = {};
        vm.itemDetail = {};
        init();
      });
    }
  }
})();
