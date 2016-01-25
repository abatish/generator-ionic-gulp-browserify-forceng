'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var browserSync = require('browser-sync');
var watchify = require('./scripts').watchify;

var $ = require('gulp-load-plugins')();

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor (done) {
  var params = process.argv;
  var args = params.length > 3 ? [params[3], params[4]] : [];
  var protractor = $.protractor.protractor({
    configFile: 'protractor.conf.js',
    args: args
  });
  return gulp.src(path.join(conf.paths.e2e, '/**/*.js'))
    .pipe(protractor)
    .on('error', function (err) {
      throw err;
    })
    .on('end', function () {
      browserSync.exit();
      watchify.close();
      done();
      process.exit(); // force gulp to exit immediately.
    });
}

gulp.task('e2e', ['serve:e2e', 'webdriver-update'], function(callback) {
  runProtractor(callback);
});
