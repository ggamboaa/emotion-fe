(function() {
  'use strict';

  angular
    .module('utn')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController(authenticationService/*, rCompany*/) {
    var vm = this,
    loginInfo = authenticationService.getUserInfo();
    //vm.company = loginInfo.company;

    /*vm.query = {id:vm.company.id};
    vm.logoList = [];

    rCompany.logo(vm.query, function (result) {
      vm.logoList = result;
      vm.logo = vm.logoList.base64String;
    });*/

    vm.showProcedure = showProcedure;
    vm.loaded = (loginInfo);

    function showProcedure(){
      var show = false;
      var userInfo = authenticationService.getUserInfo();
      if (!userInfo.permissions){
        return false;
      }else{
        var permissions = userInfo.permissions;
        if(permissions.indexOf('PROCEDURE_READ') > -1){
          show = true;
        }
        return show;
      }
    }

  }
})();
