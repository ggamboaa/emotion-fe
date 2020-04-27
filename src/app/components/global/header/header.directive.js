(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnHeader', utnHeader);

  /** @ngInject */
  function utnHeader() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/global/header/header.html',
      controller: HeaderController,
      controllerAs: 'header',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController($log, HEADER_MENU, $rootScope, $state, authenticationService) {
      var vm = this,
        stateChangeSuccess,
        allAuthInfo = null;


      vm.menu = HEADER_MENU;
      vm.showMenu = true;
      vm.isLoggedIn = false;
      vm.userInfo = null;
      vm.logout = logout;


      function logout() {
        authenticationService.logout();
      }

       function checkMenuPermissions() {
        var userPermissions = vm.userInfo.permissions;

        angular.forEach(vm.menu, function (item) {

          if (!item.hasDropDownMenu) {
            var selectedItem = item;

            selectedItem.available = false;
            if (selectedItem.requiredPermissions.length > 0) {

              if (userPermissions) {
                angular.forEach(selectedItem.requiredPermissions, function (permission) {
                  if (userPermissions.indexOf(permission) > -1) {
                    selectedItem.available = true;
                  }
                });
              } else {
                selectedItem.available = false;
              }

            } else {
              selectedItem.available = true;
            }
          } else {
            item.hasValidChilds = false;
            angular.forEach(item.dropDownItems, function (ddItem) {
              var selectedItem = ddItem;

              selectedItem.available = false;
              if (selectedItem.requiredPermissions.length > 0) {

                if (userPermissions) {
                  angular.forEach(selectedItem.requiredPermissions, function (permission) {
                    if (userPermissions.indexOf(permission) > -1) {
                      selectedItem.available = true;
                      item.hasValidChilds  = true;
                    }
                  });
                } else {
                  selectedItem.available = false;
                }

              } else {
                selectedItem.available = true;
                item.hasValidChilds  = true;
              }
            });
          }

        })
      }

      /*Verify if navigation should be showed  **NOT showed for authentication screens */
      stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        allAuthInfo = authenticationService.getAllAuthInfo();
        vm.isLoggedIn = allAuthInfo.isLoggedIn;
        vm.userInfo = allAuthInfo.userInfo;


        if (toState && toState.data) {
          vm.showMenu = !toState.data.isPublic;
        } else {
          checkMenuPermissions();
          vm.showMenu = true;
        }

        //TODO: Fix this to ask if state are for public page
        if (vm.userInfo && vm.userInfo.permissions) {
          if (!vm.isLoggedIn && toState.name !== 'forgotPassword' && toState.name !== 'resetPassword') {
            logout();
          } else {
            if (toState.name === 'login') {
              $state.go('home');
            }
          }
        } else {
          logout();
        }

      });


      $rootScope.$on('$destroy', stateChangeSuccess);
    }
  }

})();
