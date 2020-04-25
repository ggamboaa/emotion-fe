(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rPrepareOrder', function ($resource) {
      return $resource('api/prepareOrder', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/prepareOrder/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/prepareOrder',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/prepareOrder/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/prepareOrder/:id',
            params: {
              id: '@id'
            }
          },
          'getInventoryProducts': {
            method: 'GET',
            url: 'api/prepareOrder/getInventoryProducts/:id',
            params: {
              id: '@id'
            }
          },
          'cancelPrepareOrder': {
            method: 'PUT',
            url: 'api/prepareOrder/cancelPrepareOrder',
            params: {
              id: '@id'
            }
          },
          'getProducts': {
            method: 'GET',
            url: 'api/prepareOrder/getProducts',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
