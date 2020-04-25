(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rJobPosition', function ($resource) {
      return $resource('api/jobPosition', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/jobPosition/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/jobPosition',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/jobPosition/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/jobPosition/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/jobPosition/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
