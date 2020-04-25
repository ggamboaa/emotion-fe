(function() {
  'use strict';
  angular
    .module('utn')
    .factory('rPassword', function($resource) {
      return $resource('api/forgotpassword', {
        id: '@id'
      },{
        'forgot': {
          method: 'POST',
          url: 'api/forgotpassword/'
        },
        'reset': {
          method: 'POST',
          url: 'api/resetpassword/'
        }
      });
    });

})();
