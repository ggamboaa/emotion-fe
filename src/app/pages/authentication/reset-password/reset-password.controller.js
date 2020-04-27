(function() {
  'use strict';

  angular
    .module('utn')
    .controller('ResetPasswordController', ResetPasswordController);

  /** @ngInject */
  function ResetPasswordController(rPassword, $state, $timeout, $stateParams) {
    var vm = this;

    vm.loading = false;
    vm.submitAttempt = false;
    vm.message='';
    vm.resetToken = $stateParams.resetToken; // token comes in the URL


    vm.resetPasswordProcess = function(form) {
      vm.loading = true;
      vm.message='';
      if(!form.$valid) {
        vm.submitAttempt = true;
        vm.loading = false;
        return;
      }

      if (vm.password === vm.confirmPassword){
        rPassword.reset({password: vm.password, code: vm.resetToken}, function(){
          vm.message = 'Contraseña actualizada correctamente';
          vm.loading = false;
          $timeout(function(){
            $state.go('login');
          }, 2500);
        }, function(error){
          vm.message = error.data.message;
          vm.loading = false;
        });
      }else{vm.message = 'Su contraseña debe coincidir'; vm.loading = false;}
    };

  }
})();
