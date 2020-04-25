(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rReview', function ($resource) {
      return $resource('api/review', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/review/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/review',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/review/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/review/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/review/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
