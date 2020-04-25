(function () {
  'use strict';
  angular
    .module('utn')
    .factory('rTypeDocument', function ($resource) {
      return $resource('api/typeDocument', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/typeDocument/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
