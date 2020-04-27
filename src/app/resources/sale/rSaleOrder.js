(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rSaleOrder', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/saleOrder', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/saleOrder/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/saleOrder/:id',
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/saleOrder',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/saleOrder/:id',
            params: {
              id: '@id'
            }
          },
          'getProducts': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/saleOrder/getProducts',
            params: {
              id: '@id'
            }
          },
          'close': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/saleOrder/close',
            params: {
              id: '@id'
            }
          },
          'getSaleOrder': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/saleOrder/getSaleOrder',
            params: {
              id: '@id'
            }
          },
          'registerInvoice': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/registerInvoice/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
