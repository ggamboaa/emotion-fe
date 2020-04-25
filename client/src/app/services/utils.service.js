(function() {
  'use strict';

  angular
    .module('utn')
    .factory('utilsService', utilsService);

  function utilsService() {

    function isAssociatedObjectOnList(obj, list, objKey, key) {
      var found = false;
      angular.forEach(list, function (item) {
        var object = item[objKey];
        if (object) {
          if (item[objKey][key] === obj[objKey][key]) {
            found = true;
          }
        }
      });

      return found;
    }

    function validateDuplicate(obj, list, objKey1, objKey2, objKey3) {
       var found = false;
        angular.forEach(list, function (item) {
          var value1 = item[objKey1];
          var value2 = item[objKey2];
          var value3 = item[objKey3];

          if (value1 && value2 && value3 && !found) {

            if (value1.id === obj[objKey1].id
                && value2.id === obj[objKey2].id
                && value3.id === obj[objKey3].id) {
                 found = true;
              }
          }
        });
        return found;
    }

    function isObjectOnList(obj, list, key) {
      var found = false;
      angular.forEach(list, function (item) {
        if (item[key] === obj[key]) {
          found = true;
        }
      });

      return found;
    }

    function validateDuplicateList(obj, list, args) {
      var found = false;
       var arrArgs = [];
        angular.forEach(list, function (item) {
          var count = 0;
          arrArgs = [];
          angular.forEach(args, function (arg) {
            var key = item[arg];
            if (key) {
              key.arg = arg;
              arrArgs.push(key);
            }
          });

          angular.forEach(arrArgs, function (key) {
            if (key && key.id === obj[key.arg].id)  {
              count ++;
            }
          });
          if (count == args.length) {
            found = true;
          }
        });
        return found;
    }

    function isRoleOnRolesList(role, roleList) {
      var found = false;
      angular.forEach(roleList, function (item) {
        if (item.role.id == role.role.id) {
          found = true;
        }
      });
      return found;
    }

    function isDateOnList(newDate,list,key){
      var found = false;
      angular.forEach(list,function(item){
        if(item[key].getTime() === newDate[key].getTime()){
          found = true;
        }
      });
      return found;
    }

    function generateDescriptionText(dataList, start, end){
      angular.forEach(dataList, function (current) {
        current.desc = current.description.substring(start, end);
      });
      return dataList;
    }

    function deleteObjectsFromList(array, element) {
      var newArray = []
      for (var i = 0; i < array.length; i++) {
        if (array[i].id !== element.id) {
          newArray.push(array[i]);
        }
      }
      return newArray;
    }

    return {
      isAssociatedObjectOnList:isAssociatedObjectOnList,
      deleteObjectsFromList:deleteObjectsFromList,
      validateDuplicate:validateDuplicate,
      isObjectOnList:isObjectOnList,
      isRoleOnRolesList:isRoleOnRolesList,
      isDateOnList:isDateOnList,
      validateDuplicateList:validateDuplicateList,
      generateDescriptionText:generateDescriptionText
    };
  }
})();
