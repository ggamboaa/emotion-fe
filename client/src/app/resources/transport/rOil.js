(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rOil', function ($resource) {
      return $resource('api/oil', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/oil/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/oil',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/oil/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/oil/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/oil/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
