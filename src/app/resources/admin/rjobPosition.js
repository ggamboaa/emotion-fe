(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rJobPosition', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/jobPosition', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/jobPosition/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/jobPosition',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/jobPosition/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/jobPosition/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/jobPosition/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
