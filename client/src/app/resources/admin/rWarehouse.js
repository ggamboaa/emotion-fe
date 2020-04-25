(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rWarehouse', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/warehouse', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/warehouse/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/warehouse',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/warehouse/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/warehouse/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/warehouse/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
