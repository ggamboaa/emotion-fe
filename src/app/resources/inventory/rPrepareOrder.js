(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rPrepareOrder', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/prepareOrder', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/prepareOrder/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/prepareOrder',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/prepareOrder/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/prepareOrder/:id',
            params: {
              id: '@id'
            }
          },
          'getInventoryProducts': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/prepareOrder/getInventoryProducts/:id',
            params: {
              id: '@id'
            }
          },
          'cancelPrepareOrder': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/prepareOrder/cancelPrepareOrder',
            params: {
              id: '@id'
            }
          },
          'getProducts': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/prepareOrder/getProducts',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
