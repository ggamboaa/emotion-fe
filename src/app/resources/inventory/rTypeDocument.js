(function () {
  'use strict';
  angular
    .module('utn')
    .factory('rTypeDocument', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/typeDocument', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/typeDocument/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
