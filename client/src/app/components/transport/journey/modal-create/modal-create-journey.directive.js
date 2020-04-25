(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalCreateJourney', utnModalCreateJourney);

  /* @ngInject */
  function utnModalCreateJourney() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/journey/modal-create/modal-create-journey.html',
      controller: ModalCreateJourneyController,
      controllerAs: 'mCreateJourney',
      bindToController: true,
      scope:{
        journey: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalCreateJourneyController(rJourney, rVehicle, rSaleOrder, rCustomer, rEmployee, SweetAlert, $rootScope, toastr, moment) {
      var vm = this;

      vm.status = true;
      vm.newJourney = {};
      vm.dateUI = new Date()

      vm.dismissModal = dismissModal;
      vm.searchVehicle = searchVehicle;
      vm.searchEmployee = searchEmployee;
      vm.searchInvoice = searchInvoice;
      vm.createJourney = createJourney;

      vm.setDetail = setDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;

      function init () {
        vm.newJourney.status = true;
        vm.newJourney.invoiceDetailList = [];
        loadVehicle();
        loadEmployee();
        loadInvoice();
      }
      init();

      function addDetail () {
        var detailToAdd = {};
        // vm.addAttempt = true;
        vm.duplicate = false;

        detailToAdd.numberInvoice = vm.itemDetail.detailInvoice.Document_Detail.numberInvoice;
        detailToAdd.customer = vm.customer;
        detailToAdd.documentCode = vm.itemDetail.detailInvoice.code;
        detailToAdd.documentId = vm.itemDetail.detailInvoice.id;
        detailToAdd.documentDetailId = vm.itemDetail.detailInvoice.Document_Detail.id;

        if(vm.newJourney.invoiceDetailList.length < 1){
          vm.newJourney.invoiceDetailList.push(detailToAdd);
        }
        else{
          var flag = false;
          angular.forEach(vm.newJourney.invoiceDetailList, function(res){
            if(res.numberInvoice == detailToAdd.numberInvoice){
              flag = true;
            }
          })
          if(flag){
            toastr.error('La factura ya se encuentra Agregada');
            }
            else{
              vm.newJourney.invoiceDetailList.push(detailToAdd);
            }
        }
        vm.itemDetail = {};
        vm.customer = '';
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
              vm.newJourney.invoiceDetailList.splice(index, 1);
            }
          }
        );
      }

      function setDetail(item){
        vm.customer = '';
        if(item){
          rCustomer.query({id: item}, function(res){
            vm.customer = res.identification+ '  -  ' + res.name + ' ' + res.firstName + ' ' + res.lastName;
          });
        }

      }

      function loadInvoice(){
        rJourney.query(vm.journey.query, function(result){
          vm.invoiceList  = result.records;
        });
      }

      function searchInvoice(filter){
          if(filter.search == ''){
            loadInvoice();
          }
          else{
            vm.query = {filter: filter.search, WarehouseId: vm.journey.query.WarehouseId };
            rJourney.query(vm.query, function (result){
              vm.invoiceList = result.records;
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

      function createJourney(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.newJourney.invoiceDetailList<1){
          toastr.error('Ruta de Entrega debe contener al menos una Factura asociada');
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        if(vm.dateUI){
          vm.newJourney.date = moment(vm.dateUI).format('YYYY-MM-DD');
        }

        if(vm.employee){
          vm.newJourney.driverEmployeeId = vm.employee.id;
        }

        if(vm.vehicle){
          vm.newJourney.vehicleId = vm.vehicle.id;
        }

        vm.newJourney.warehouseId = vm.journey.query.WarehouseId;

        rJourney.save(vm.newJourney, function(){
          vm.loading = false;
          vm.submitAttempt = false;
          toastr.success('Ruta de Entrega registrada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.newJourney = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalCreateJourney').modal('hide');
              }
              $rootScope.$broadcast('journeyEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al crear Ruta de Entrega');
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
              vm.newJourney = {};
              vm.vehicle = '';
              vm.employee = '';
              vm.itemDetail = '';
              vm.customer = '';
              vm.dateUI = new Date()

              angular.element('#modalCreateJourney').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalCreateJourney').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalCreateJourney').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.newJourney = {};
        init();
      });
    }
  }
})();
