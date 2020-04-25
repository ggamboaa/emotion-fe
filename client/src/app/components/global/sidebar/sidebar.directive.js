(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnSidebar', utnSidebar);

  /** @ngInject */
  function utnSidebar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/global/sidebar/sidebar.html',
      controller: SidebarController,
      controllerAs: 'sidebar',
      scope: {
        title: '@'
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SidebarController(rEmployee, $rootScope, $log, $timeout, $state, HEADER_MENU, SIDEBAR_MENU, authenticationService) {
      var vm = this,
        stateChangeSuccess,
        allAuthInfo,
        onRolesLoaded;

      vm.selectedItem = $state.current.name;
      vm.selectedItem = vm.selectedItem.split('.')[0];
      vm.items = [];
      vm.sideBarItems = SIDEBAR_MENU;
      var userInfo = null;
      vm.warehouse = null;

      userInfo = authenticationService.getUserInfo();
      vm.userConected = userInfo[0].user;
      var userPermissions = userInfo.permissions;

      vm.logout = logout;
    
      onRolesLoaded = $rootScope.$on('rolesLoaded', function () {
        loadSidebar();
      });

      function logout() {
        authenticationService.logout();
      }

      $rootScope.$on('$destroy', onRolesLoaded);

      function loadSidebar() {
        vm.items = [];
        var currentItem = {};
        var currentItemFound = false;

        angular.forEach(HEADER_MENU, function (item) {

          if(!currentItemFound){
            if (item.hasDropDownMenu) {
              angular.forEach(item.dropDownItems, function (ddItem) {
                if (ddItem.routerState === vm.selectedItem) {
                  currentItem = ddItem;
                  currentItemFound = true;
                }
              });
            } else {
              if(item.routerState === vm.selectedItem){
                currentItem = item;
                currentItemFound = true;
              }
            }

            if (currentItemFound) {
              vm.items = currentItem.subNavItems;

              // angular.forEach(vm.items, function (pItem) {
              //   pItem.available = true;
              // });

              // userInfo = authenticationService.getUserInfo();
              // vm.userConected = userInfo[0].user;
              // var userPermissions = userInfo.permissions;
 
              if(userInfo.length > 0){
                angular.forEach(vm.items, function (pItem) {
                  pItem.available = false;
                  if (pItem.requiredPermissions.length > 0) {
                    angular.forEach(pItem.requiredPermissions, function (permissions) {
                      if (userPermissions.indexOf(permissions) > -1) {
                        pItem.available = true;
                      }
                    });
                  } else {
                    pItem.available = true;
                  }
                });                
              }else{
                $state.go('login');
              }
            }
          }

        });
      }

      /*stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', function(){
       $log.info('state change sidebar');
       allAuthInfo = authenticationService.getAllAuthInfo();
       vm.userInfo = allAuthInfo.userInfo;
       });*/

      function init() {
        allAuthInfo = authenticationService.getAllAuthInfo();
        vm.userInfo = allAuthInfo.userInfo;
        if(authenticationService.getUserInfo()[0].warehouseSelected){
          vm.warehouse = authenticationService.getUserInfo()[0].warehouseSelected.name;
        }
      }

      stateChangeSuccess = $rootScope.$on('stateChangeSuccess', function() {
        //loadSidebar();
        init();
      });

      $rootScope.$on('$destroy', stateChangeSuccess);

      loadSidebar();
      init();
    }
  }

})();
