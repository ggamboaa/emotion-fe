(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rDepartment', function ($resource) {
      return $resource('api/department', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/department/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/department',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/department/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/department/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/department/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
