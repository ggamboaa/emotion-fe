(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rTracking', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/tracking', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/tracking/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/tracking',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/tracking/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/tracking/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/tracking/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();