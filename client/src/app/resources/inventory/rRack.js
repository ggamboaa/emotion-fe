(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rRack', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/rack', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/rack/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
