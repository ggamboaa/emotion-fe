(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalInfoUbication', utnModalInfoUbication);

  /* @ngInject */
  function utnModalInfoUbication() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/ubication/modal-info/modal-info-ubication.html',
      controller: ModalInfoUbicationController,
      controllerAs: 'mInfoUbication',
      bindToController: true,
      scope:{
        selectedUbication: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalInfoUbicationController(rUbication, SweetAlert/*, $rootScope, toastr*/) {
      var vm = this;
      vm.ubicationInfo= {};
      // vm.infoUbication = infoUbication;
      vm.dismissModal = dismissModal;

      function init () {}
      init();

      function ubicationToInfo(){
        if(vm.selectedUbication){
          rUbication.query({id:vm.selectedUbication.id}, function(result){
            vm.ubicationInfo  = result;
            vm.ubicationInfo.status = (vm.ubicationInfo.status == 1)?"Activo":"Desactivo";
          });
        }
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
                angular.element('#modalInfoUbication').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalInfoUbication').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalInfoUbication').on('shown.bs.modal', function(){
        ubicationToInfo();
      });

      angular.element('#modalInfoUbication').on('show.bs.modal', function(){
        vm.loading = false;
        vm.submitAttempt = false;
        vm.ubicationInfo = {};
        init();
      });

    }
  }
})();
