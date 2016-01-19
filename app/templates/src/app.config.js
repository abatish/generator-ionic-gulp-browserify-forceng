var angular = require('angular');

angular.module('<%= ngModulName %>.config', [])
  .constant('mySpecialConstant', 42);

module.exports = '<%= ngModulName %>.config';
