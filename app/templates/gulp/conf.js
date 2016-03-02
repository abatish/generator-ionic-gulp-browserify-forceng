/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util'),
    argv = require('yargs')
            .boolean(['prod'])
            .default('prod', false)
            .default('platform', 'android')
            .argv;

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'www',
  build: 'build',
  app: 'src/app',
  tmp: '.tmp',
  e2e: 'e2e',
  npm: 'node_modules',
  res: 'resources',
  hooks: 'hooks',
  assets: 'src/assets'
};

exports.platform = argv.platform;

exports.prod = argv.prod;

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

exports.logHandler = function(title) {
 'use strict';

 return function(msg) {
   gutil.log(gutil.colors.cyan('[' + title + ']'), msg);
 };
};
