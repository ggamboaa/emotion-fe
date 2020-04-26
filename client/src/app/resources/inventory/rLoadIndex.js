(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rLoadIndex', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/loadIndex', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/loadIndex/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
