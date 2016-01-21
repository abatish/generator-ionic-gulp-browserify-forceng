var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    conf = require('./conf');

function initServer(baseDir) {
  var routes = {};

  browserSync.init({
    server: {
      baseDir: baseDir,
      routes: routes
    }
  });
}

gulp.task('serve', ['watch'], function () {
  return initServer(options.paths.build);
});
