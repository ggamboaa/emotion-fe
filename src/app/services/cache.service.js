(function() {
  'use strict';

  angular
  .module('utn')
  .factory('cacheService', cacheService);

  function cacheService(/*rVendor,*/ $window) {
    var vendorsList = [];


    function loadVendosrList(){
      if ($window.sessionStorage['vendorsList']){
        vendorsList = angular.fromJson($window.sessionStorage['vendorsList']);
      }else{
        /*rVendor.query({pagesize:350, sort:'company'}, function(result){
          vendorsList = result.records;
          $window.sessionStorage['vendorsList'] = angular.toJson(vendorsList);
        });*/
      }
    }


    function getVendorsList() {
      return vendorsList;
    }

    function init() {
      loadVendosrList();
    }



    return {
      init:init,
      getVendorsList:getVendorsList
    };
  }
})();
