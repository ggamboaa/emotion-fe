(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalEditCustomer', utnModalEditCustomer);

  /* @ngInject */
  function utnModalEditCustomer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sale/customer/modal-edit/modal-edit-customer.html',
      controller: ModalEditCustomerController,
      controllerAs: 'mEditCustomer',
      bindToController: true,
      scope:{
        selectedCustomer: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditCustomerController(rCustomer, rWarehouse, SweetAlert, $rootScope, toastr, moment, DATE_ISO_FORMAT, VERIFY_EMAIL) {
      var vm = this;

      vm.verifyEmail = VERIFY_EMAIL;
      vm.birthdateUI = new Date();

      vm.sexList = [{id:1, name:'Femenino'},{id:2, name:'Masculino'}];
      vm.typeCustomerList = [{id:1, name:'Normal'},{id:2, name:'Mayoreo'}];

      vm.customerEdited = {};
      vm.customerEdited.status = 0;

      vm.searchWarehouse = searchWarehouse;
      vm.editCustomer = editCustomer;
      vm.dismissModal = dismissModal;

      function init () {
        loadWarehouse();
      }
      init();

       function customerToEdit(){
        vm.showCompany = false
        rCustomer.query({id:vm.selectedCustomer.id}, function(result){
          vm.customerEdited  = result;

          if(vm.customerEdited.birthdate){
            vm.birthdateUI = moment(vm.customerEdited.birthdate, DATE_ISO_FORMAT).toDate();
          }

          vm.customerEdited.status = (vm.customerEdited.status == 1)? true:false;
          vm.customerEdited.sexDup = (vm.customerEdited.sex == 1) ? vm.sexList[0]:vm.sexList[1];
          vm.customerEdited.typeCustomerDup = (vm.customerEdited.typeCustomer == 1) ? vm.typeCustomerList[0]:vm.typeCustomerList[1];

        });
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

      function editCustomer(form){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }
        
        vm.customerEdited.birthdate = moment(vm.birthdateUI).format('YYYY-MM-DD');

        if(vm.customerEdited.sexDup){
          vm.customerEdited.sex = vm.customerEdited.sexDup.id; 
        }

        if(vm.customerEdited.typeCustomerDup){
          vm.customerEdited.typeCustomer = vm.customerEdited.typeCustomerDup.id; 
        }

        if(vm.customerEdited.warehouse){
          vm.customerEdited.warehouseId = vm.customerEdited.warehouse.id; 
        }

        rCustomer.update(vm.customerEdited, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Cliente actualizado satisfactoriamente', {
            onShown: function(){
              angular.element('#modalEditCustomer').modal('hide');
              $rootScope.$broadcast('customerEdited');
            }
          });
        },function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al actualizar Cliente');
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
                angular.element('#modalEditCustomer').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalEditCustomer').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditCustomer').on('shown.bs.modal', function(){
        vm.showCompany = false
        customerToEdit();
      });

      angular.element('#modalEditCustomer').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.showCompany = false
        vm.customerToEdit = {};
        init();
      });

    }
  }
})();
