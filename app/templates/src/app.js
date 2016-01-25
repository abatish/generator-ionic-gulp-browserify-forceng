'use strict';

 require('angular-resource');
 require('ionic-angular');
 require('ng-cordova');
 var angular = require('angular');

angular.module( '<%= ngModulName %>', [
  'ionic', 'ngResource', 'ngCordova',
  require('forceng'), require('./app.config.js')
] )

.run( require('./app.run.js') )

.config( require('./app.routes.js') )

.controller( 'MainController',     require( './main/main.controller'     ) )
.controller( 'HomeController',     require( './home/home.controller'     ) )
.controller( 'SettingsController', require( './settings/settings.controller' ) )

.factory( 'ExampleService',        require( './components/example/example.service' ) ) ;
