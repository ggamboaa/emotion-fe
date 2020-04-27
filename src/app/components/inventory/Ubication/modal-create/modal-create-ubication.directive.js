(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateUbication', utnModalCreateUbication);

  /* @ngInject */
  function utnModalCreateUbication() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/ubication/modal-create/modal-create-ubication.html',
      controller: ModalCreateUbicationController,
      controllerAs: 'mCreateUbication',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalCreateUbicationController(rUbication, rWarehouse, rRack, rPosition, rLevel, rProduct, SweetAlert, $rootScope, toastr) {
      var vm = this;
      vm.status = true;
      vm.newUbication = {status:true};

      vm.searchWarehouse = searchWarehouse;
      vm.searchRack = searchRack;
      vm.searchPosition = searchPosition;
      vm.searchLevel = searchLevel;
      vm.searchProduct = searchProduct;

      vm.createUbication = createUbication;
      vm.dismissModal = dismissModal;

      function init () {
        vm.newUbication.status = true;
        vm.newUbication.productsDetailList = [];
        loadWarehouse();
        loadRack();
        loadPosition();
        loadLevel();
        loadProduct();
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

      function loadRack(){
        rRack.query(function(result){
          vm.rackList  = result.records;
        });
      }

      function searchRack(filter){
        if(filter.search == ''){
          loadRack();
        }else{
          vm.query = {filter: filter.search};
          rRack.query(vm.query, function (result) {
            vm.rackList = result.records;
          });
        }
      }

      function loadPosition(){
        rPosition.query(function(result){
          vm.positionList  = result.records;
        });
      }

      function searchPosition(filter){
        if(filter.search == ''){
          loadPosition();
        }else{
          vm.query = {filter: filter.search};
          rPosition.query(vm.query, function (result) {
            vm.positionList = result.records;
          });
        }
      }

      function loadLevel(){
        rLevel.query(function(result){
          vm.levelList  = result.records;
        });
      }

      function searchLevel(filter){
        if(filter.search == ''){
          loadLevel();
        }else{
          vm.query = {filter: filter.search};
          rLevel.query(vm.query, function (result) {
            vm.levelList = result.records;
          });
        }
      }

      function loadProduct(){
        rProduct.query(function(result){
          vm.productList  = result.records;
        });
      }

      function searchProduct(filter){
        if(filter.search == ''){
          loadProduct();
        }else{
          vm.query = {filter: filter.search};
          rProduct.query(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }

      function createUbication(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newUbication.warehouse){
          vm.newUbication.warehouseId = vm.newUbication.warehouse.id; 
        }

        if(vm.newUbication.rack){
          vm.newUbication.rackId = vm.newUbication.rack.id; 
        }

        if(vm.newUbication.position){
          vm.newUbication.positionId = vm.newUbication.position.id; 
        }

        if(vm.newUbication.level){
          vm.newUbication.levelId = vm.newUbication.level.id; 
        }

        if(vm.newUbication.rack && vm.newUbication.position && vm.newUbication.level){
          vm.newUbication.ubicationName = vm.newUbication.rack.rackName + '' + vm.newUbication.position.positionName + '' + vm.newUbication.level.levelName;
        }

        rUbication.save(vm.newUbication, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Ubicación registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newUbication = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateUbication').modal('hide');
              }
              $rootScope.$broadcast('ubicationEdited');
            }
          });
        },
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          if(error.data.parent.errno && error.data.parent.errno == 1062){
            toastr.error('Ubicación ingresada anteriormente. Verifíque!', 'Error al crear Ubicación');
          }else{
            angular.forEach(error.data.errors, function(item){
              errorNo++;
              errorMsg += errorNo + '-' + item.message + '<br/>';
            })
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Ubicación');
          }
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
              angular.element('#modalCreateUbication').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateUbication').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateUbication').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newUbication = {};
        vm.newUbication.productsDetailList = [];
        init();
      });

    }
  }
})();
