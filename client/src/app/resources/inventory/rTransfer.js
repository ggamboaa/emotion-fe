(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rTransfer', function ($resource) {
      return $resource('api/transfer', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/transfer/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/transfer',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/transfer/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/transfer/:id',
            params: {
              id: '@id'
            }
          },
          'getProducts': {
            method: 'GET',
            url: 'api/transfer/getProducts/:id',
            params: {
              id: '@id'
            }
          },
          'sendProducts': {
            method: 'PUT',
            url: 'api/transfer/sendProducts/:id',
            params: {
              id: '@id'
            }
          },
          'getReceiptTransfer': {
            method: 'GET',
            url: 'api/transfer/getReceiptTransfer',
            params: {
              id: '@id'
            }
          },
          'receiptProducts': {
            method: 'PUT',
            url: 'api/transfer/receiptProducts/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
