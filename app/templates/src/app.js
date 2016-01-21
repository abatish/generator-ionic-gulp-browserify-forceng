'use strict';

/**
 * @ngdoc overview
 * @name <%= ngModulName %>
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */
 
require('ionic');
var angular = require('angular');

angular.module( '<%= ngModulName %>', [
  'ionic', require('ng-cordova'), require('angular-resource'),
  require('forceng'), require('./app.config.js')
] )

.run( require('./app.run.js') )

.config( require('./app.routes.js') )

.controller( 'MainController',     require( './components/main/mainController'     ) )
.controller( 'HomeController',     require( './components/home/homeController'     ) )
.controller( 'SettingsController', require( './components/settings/settingsController' ) )

.factory( 'ExampleService',        require( './shared/example/ExampleService' ) ) ;
