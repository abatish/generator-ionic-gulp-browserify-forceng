'use strict';

/**
 * @ngdoc function
 * @name <%= ngModulName %>.service:ExampleService
 * @description
 * # ExampleService
 */
module.exports = [ '$http', '$timeout', '$q', 'mySpecialConstant',
    function( $http, $timeout, $q, mySpecialConstant ) {
      var kindOfPrivateVariable = mySpecialConstant;

      var doSomethingAsync = function() {
        var deferred = $q.defer();
        $timeout(deferred.resolve.bind(null, kindOfPrivateVariable), 1000);
        return deferred.promise;
      };

      var fetchSomethingFromServer = function() {
        return $http({
            url: 'http://hipsterjesus.com/api',
            params: {
                paras: 2
            },
            method: 'GET'
          })
          .success(function(data) {
            console.log('fetched this stuff from server:', data);
          })
          .error(function(error) {
            console.log('an error occured', error);
          });
      };

      // public api
      return {
        doSomethingAsync: doSomethingAsync,
        fetchSomethingFromServer: fetchSomethingFromServer
      };
    }
];
