'use strict';

 require('angular-resource')
 require('ionic-angular');
 require('ng-cordova')
 var angular = require('angular');

angular.module( '<%= ngModulName %>', [
  'ionic', 'ngResource', 'ngCordova',
  require('forceng'), require('./app.config.js')
] )

.run( require('./app.run.js') )

.config( require('./app.routes.js') )

.controller( 'MainController',     require( './main/mainController'     ) )
.controller( 'HomeController',     require( './home/homeController'     ) )
.controller( 'SettingsController', require( './settings/settingsController' ) )

.factory( 'ExampleService',        require( './components/example/ExampleService' ) ) ;
