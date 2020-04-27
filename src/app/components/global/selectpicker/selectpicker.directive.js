(function() {
  'use strict';

  angular
    .module('utn')
    .directive('selectpicker', Selectpicker);

  /** @ngInject */
  function Selectpicker() {
    var directive = {
      restrict: 'A',
      scope:true,
      link:SelectpickerLink
    };

    return directive;

    /** @ngInject */
    function SelectpickerLink(scope, element, iAttrs){
      scope.$watchCollection(iAttrs['selectpicker'], function(){
        element.selectpicker();
      });
    }
  }

})();
