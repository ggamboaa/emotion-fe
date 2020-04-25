(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalShowPhoto', utnModalShowPhoto);

  /* @ngInject */
  function utnModalShowPhoto() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/information/show-photo/modal-show-photo.html',
      controller: ModalShowPhotoController,
      controllerAs: 'mShowPhoto',
      bindToController: true
    };

    return directive;

    /* @ngInject */
    function ModalShowPhotoController(authenticationService, SweetAlert) {
      var vm = this;
      vm.loading = false;
      vm.submitAttempt = false;

      vm.dismissModal = dismissModal;

      function init() {}

      function dismissModal (form){
        if(!form.$pristine) {
          SweetAlert.swal({
              title:'',
              text: '¿Esta seguro de salir sin seleccionar usuario?',
              showCancelButton: true,
              confirmButtonText:'Sí',
              cancelButtonText:'No',
              closeOnConfirm: true,
              closeOnCancel: true,
              allowEscapeKey: false
            },
            function(isConfirm){
              if (isConfirm) {
                angular.element('#modalShowPhoto').modal('hide');
                form.$setPristine();
              }
            }
          );
        }else{
          angular.element('#modalShowPhoto').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalShowPhoto').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        init();
      });

      angular.element('#modalShowPhoto').on('shown.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        init();
      });

      angular.element('#modalShowPhoto').on('hidden.bs.modal', function () {
      });
    }
  }

})();
