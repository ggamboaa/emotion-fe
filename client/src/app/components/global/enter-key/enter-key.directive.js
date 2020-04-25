(function() {
  'use strict';

  angular
    .module('utn')
    .directive('enterKey', enterKey);

  /** @ngInject */
  function enterKey() {
    var directive = {
      restrict: 'A',
      scope:true,
      link:SelectpickerLink
    };

    return directive;

    /** @ngInject */
    function SelectpickerLink(scope, element, attrs){
      element.bind('keydown keypress', function(event) {
        var keyCode = event.which || event.keyCode;

        // If enter key is pressed
        if (keyCode === 13) {
          scope.$apply(function() {
            // Evaluate the expression
            scope.$eval(attrs.enterKey);
          });

          event.preventDefault();
        }
      });
    }
  }

})();
