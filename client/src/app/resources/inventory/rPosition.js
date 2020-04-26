(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rPosition', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/position', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/position/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
