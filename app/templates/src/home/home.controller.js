'use strict';

// import our template file
require('./home.html');


module.exports = [
    // fetch our dependencies
    '$scope',
    'force',

    // create our controller
    function( $scope, force ) {
      var vm = this;

      vm.userId = null;

      vm.login = function () {
        force.login().then(function(res){
          vm.userId = force.getUserId();
        });
      };

      vm.logout = function () {
        vm.userId = null;
        force.discardToken();
      };
    }
];
