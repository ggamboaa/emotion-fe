(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rRack', function ($resource) {
      return $resource('api/rack', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/rack/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
