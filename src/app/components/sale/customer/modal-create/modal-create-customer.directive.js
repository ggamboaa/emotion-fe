(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalCreateCustomer', utnModalCreateCustomer);


  /* @ngInject */
  function utnModalCreateCustomer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sale/customer/modal-create/modal-create-customer.html',
      controller: ModalCreateCustomerController,
      controllerAs: 'mCreateCustomer',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateCustomerController(rCustomer, rWarehouse, SweetAlert, $rootScope, toastr, moment, VERIFY_EMAIL) {
      var vm = this;

      vm.verifyEmail = VERIFY_EMAIL;
      vm.birthdateUI = new Date();
      vm.status = true;

      vm.sexList = [{id:1, name:'Femenino'},{id:2, name:'Masculino'}];
      vm.typeCustomerList = [{id:1, name:'Normal'},{id:2, name:'Mayoreo'}];

      vm.newCustomer = {status:true};

      vm.searchWarehouse = searchWarehouse;
      vm.createCustomer = createCustomer;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newCustomer.status = true;
        loadWarehouse();
      }
      init();

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

      function createCustomer(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        vm.newCustomer.birthdate = moment(vm.birthdateUI).format('YYYY-MM-DD');

        if(vm.newCustomer.sexDup){
          vm.newCustomer.sex = vm.newCustomer.sexDup.id; 
        }

        if(vm.newCustomer.typeCustomerDup){
          vm.newCustomer.typeCustomer = vm.newCustomer.typeCustomerDup.id; 
        }

        if(vm.newCustomer.warehouse){
          vm.newCustomer.warehouseId = vm.newCustomer.warehouse.id; 
        }

        rCustomer.save(vm.newCustomer, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Cliente registrado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newCustomer = {status: true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateCustomer').modal('hide');
              }
              $rootScope.$broadcast('customerEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Cliente');
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
              vm.newCustomer = {};
              if (isConfirm) {
                angular.element('#modalCreateCustomer').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalCreateCustomer').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateCustomer').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;

        vm.newCustomer = {};
        init();
      });

    }
  }
})();
