(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rPosition', function ($resource) {
      return $resource('api/position', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/position/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
