(function() {
  'use strict';

  angular
    .module('utn')
    .directive('utnFooter', utnFooter);

  /** @ngInject */
  function utnFooter(FOOTER_MENU) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/global/footer/footer.html',
      controller: FooterController,
      controllerAs: 'footer',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function FooterController() {
      var vm = this;

      vm.menu = FOOTER_MENU;

    }
  }

})();
