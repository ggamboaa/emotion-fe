(function() {
  'use strict';

  angular
    .module('utn')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController(rUser, authenticationService, bsLoadingOverlayService, $state, toastr) {
    var vm = this;
    vm.loading = false,
    vm.submitAttempt = false,
    
    vm.credentials = {};
    vm.user = {};
    vm.loginProcess = loginProcess;

    function loginProcess (form){
      vm.loading = true;

      if(!form.$valid) {
        vm.loading = false;
        vm.submitAttempt = true;
        return;
      }

      authenticationService.login(vm.credentials)
        .then(function(result){

          if(result){
            if(result[0].status != 1){
              vm.loading = false;
              toastr.error('Usuario inactivo. Verifíque!.');
              bsLoadingOverlayService.stop({referenceId: 'user-overlay'});
            }
          }

          if(vm.loading){
            $state.go('adminProcess');
            vm.loading = false;
          }

        }, function(){
          vm.loading = false;
          toastr.error('Usuario y/o contraseña inválido(s). Verifíque!.');
          bsLoadingOverlayService.stop({referenceId: 'user-overlay'});
        });
    }
  }
})();
