(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rTransfer', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/transfer', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/transfer/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/transfer',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/transfer/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/transfer/:id',
            params: {
              id: '@id'
            }
          },
          'getProducts': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/transfer/getProducts/:id',
            params: {
              id: '@id'
            }
          },
          'sendProducts': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/transfer/sendProducts/:id',
            params: {
              id: '@id'
            }
          },
          'getReceiptTransfer': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/transfer/getReceiptTransfer',
            params: {
              id: '@id'
            }
          },
          'receiptProducts': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/transfer/receiptProducts/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
