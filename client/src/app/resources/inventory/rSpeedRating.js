(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rSpeedRating', function ($resource) {
      return $resource('api/speedRating', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/speedRating/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
