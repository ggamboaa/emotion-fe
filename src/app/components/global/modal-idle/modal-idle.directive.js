(function() {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalIdle', utnModalIdle);

  /** @ngInject */
  function utnModalIdle() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/global/modal-idle/modal-idle.html',
      controller: ModalIdleController,
      controllerAs: 'mIdle',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ModalIdleController() {

    }
  }

})();
