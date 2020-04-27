(function() {
  'use strict';
  angular
    .module('utn')
    .factory('rPassword', function($resource) {
      return $resource('https://emotion-be.herokuapp.com/forgotpassword', {
        id: '@id'
      },{
        'forgot': {
          method: 'POST',
          url: 'https://emotion-be.herokuapp.com/forgotpassword/'
        },
        'reset': {
          method: 'POST',
          url: 'https://emotion-be.herokuapp.com/resetpassword/'
        }
      });
    });

})();
