(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rLevel', function ($resource) {
      return $resource('api/level', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/level/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
