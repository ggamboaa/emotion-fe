(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rRepair', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/repair', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/repair/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/repair',
            params: {
              id: '@id'
            }
          },
          'close': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/repair/close',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/repair/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/repair/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/repair/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
