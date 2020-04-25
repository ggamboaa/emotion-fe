(function () {
  'use strict';

  angular
  .module('utn')
  .run(runBlock);

  /** @ngInject */
  function runBlock($log, bsLoadingOverlayService, $timeout, $state, $rootScope, authenticationService, DATE_FORMAT, DATE_PICKER_FORMAT, SweetAlert, Idle, uibDatepickerPopupConfig) {

    var stateChange,
      APIAuthError,
      openReport;

    $rootScope.dateFormat = DATE_FORMAT;
    $rootScope.datePickerFormat = DATE_PICKER_FORMAT;
    uibDatepickerPopupConfig.closeText = 'Cerrar';
    uibDatepickerPopupConfig.currentText = 'Hoy';
    uibDatepickerPopupConfig.clearText = 'Limpiar';

    bsLoadingOverlayService.setGlobalConfig({
      delay: 50,
      activeClass: 'active-overlay',
      templateUrl: 'app/components/global/loading-overlay/loading-overlay.html'
    });


    stateChange = $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState && toState.params) {
          if (toState.params.autoActivateChild) {
            $state.go(toState.params.autoActivateChild);
          } else if (toState.params.childList) {
            var userInfo = authenticationService.getUserInfo();
            var permissions = userInfo.permissions;
            var found = false;
            angular.forEach(toState.params.childList, function (child) {
              if (!found) {
                if (child.requiredPermissions.length > 0) {
                  if (permissions.indexOf(child.requiredPermissions[0]) > -1) {
                    $state.go(child.routerState);
                    found = true;
                  }
                } else {
                  $state.go(child.routerState);
                  found = true;
                }
              }
            });
          }
        } else {
          if (!authenticationService.isLoggedIn()) {
            if (toState.name !== 'login' && toState.name !== 'forgotPassword' && toState.name !== 'resetPassword') {
              logout();
              $state.go('login');
            }
          }
        }
        $timeout(function () {
          angular.element('.scroller').perfectScrollbar('update');
        }, 200);
      }
    );

    function logout() {
      authenticationService.logout();
    }

    function closeModals() {
      angular.element('#modalIdle').modal('hide');
    }

    $rootScope.hasPermissionsFor = function (permissionRequired) {
      var hasPermission = false;

      var userInfo = authenticationService.getUserInfo();

      if (userInfo) {
        var permissions = userInfo.permissions;

        if (userInfo.administrator) {
          permissions.push('ADMINISTRATOR')
        }

        if (permissions) {
          if (permissions.indexOf(permissionRequired) >= 0) {
            hasPermission = true;
          }
        }

      }
      return hasPermission;
    };

    APIAuthError = $rootScope.$on('401UnauthorizedError', function () {
      authenticationService.logout();
      closeModals();
      $timeout(function () {
        SweetAlert.swal({
            title: '',
            text: 'Su sesión expiró o intentó realizar una acción para la que no está autorizado',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
            closeOnConfirm: true,
            closeOnCancel: true

        });
        }, 1000);

    });
    openReport = $rootScope.$on('openReport', function (scope, data) {
      $rootScope.reportParams = data;
      if (data) {
        angular.element('#modalReport').modal({ backdrop: 'static', keyboard: false });
      }
    });


    $rootScope.$on('$destroy', stateChange);
    $rootScope.$on('$destroy', APIAuthError);
    $rootScope.$on('$destroy', openReport);

  }

})
();
