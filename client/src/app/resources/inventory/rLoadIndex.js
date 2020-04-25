(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rLoadIndex', function ($resource) {
      return $resource('api/loadIndex', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/loadIndex/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
