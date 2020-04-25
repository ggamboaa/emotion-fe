(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rSaleOrder', function ($resource) {
      return $resource('api/saleOrder', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/saleOrder/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/saleOrder/:id',
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/saleOrder',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/saleOrder/:id',
            params: {
              id: '@id'
            }
          },
          'getProducts': {
            method: 'GET',
            url: 'api/saleOrder/getProducts',
            params: {
              id: '@id'
            }
          },
          'close': {
            method: 'POST',
            url: 'api/saleOrder/close',
            params: {
              id: '@id'
            }
          },
          'getSaleOrder': {
            method: 'GET',
            url: 'api/saleOrder/getSaleOrder',
            params: {
              id: '@id'
            }
          },
          'registerInvoice': {
            method: 'PUT',
            url: 'api/registerInvoice/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
