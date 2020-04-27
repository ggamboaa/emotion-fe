(function() {
  'use strict';

  angular
    .module('utn')
    .controller('ForgotPasswordController', ForgotPasswordController);

  /** @ngInject */
  function ForgotPasswordController(rUser, authenticationService, toastr, $state) {
    var vm = this;
    vm.loading = false;
    vm.submitAttempt = false;
    vm.message = '';
    vm.change = change;

    var userInfo = authenticationService.getUserInfo();
    vm.userEdited = userInfo[0];
    
    vm.forgotPasswordProcess = function(form) {
      vm.loading = true;
      vm.message='';

      if(!form.$valid){
        vm.submitAttempt = true;
        vm.loading = false;
        return;
      }

      /*rPassword.forgot({username:vm.username}, function(){
        vm.message = 'El link para crear una nueva contraseña ha sido enviado a su correo electrónico';
        vm.loading = false;
      }, function(error){
        vm.message = error.data.message;
        vm.loading = false;
      });*/
    };

    function change(form){

      if(!form.$valid){
        vm.submitAttempt = true;
        vm.loading = false;
        return;
      }

      vm.listIds = [];
      angular.forEach(vm.userEdited.Rols, function(item){
        vm.listIds.push(item.id);
      })

      vm.userEdited.ids = vm.listIds;

      if(vm.userEdited.newPassword == vm.userEdited.confirmPassword){
        vm.userEdited.password = vm.userEdited.newPassword;
      }else{
        toastr.error('Contraseñas no coinciden. Verifíque!', 'Error al cambiar contraseña');
        vm.submitAttempt = true;
        vm.loading = false;
        return;
      }

      rUser.update(vm.userEdited, function(){
        vm.loading = false;
        vm.submitAttempt = false;
        toastr.success('Contraseña actualizada satisfactoriamente', {
          onShown: function(){
            $state.go('home');
          }
        });
      }, function(error){
        var errorMsg = '';
        var errorNo = 0;
        vm.loading = false;
        vm.submitAttempt = false;
        if(error.data.parent.errno == 1062){
          toastr.error('Usuario ya ha sido registrado. Verifíque!', 'Error al cambiar contraseña');
        }else{
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          toastr.error("Ajuste(s): " + errorMsg, 'Error al cambiar contraseña');
        }
      });
    }

   }
})();
