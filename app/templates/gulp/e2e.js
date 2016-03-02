'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var browserSync = require('./serve').bsInstance;
var watchify = require('./scripts').watchify;

var $ = require('gulp-load-plugins')();

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor (done) {

  var protractor = $.protractor.protractor({
    configFile: 'protractor.conf.js'
  });

  gulp.src(path.join(conf.paths.e2e, '/**/*.js'))
    .pipe(protractor)
    .on('error', function (err) {
      done(err);
    })
    .on('end', function () {
      done();
      setTimeout(function () {
        browserSync.exit();
      }, 100);
    });
}

gulp.task('e2e', ['serve:e2e', 'webdriver-update'], function (done) {
  runProtractor(done)
});
