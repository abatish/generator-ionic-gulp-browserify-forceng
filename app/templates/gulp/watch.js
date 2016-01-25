var gulp = require('gulp'),
    path = require('path'),
    conf = require('./conf'),
    browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['build'], function () {
  gulp.watch([
    path.join(conf.paths.src, 'index.html'),
    path.join(conf.paths.build, 'app/bundle.js'),
    path.join(conf.paths.app, '/**/*.html'),
    path.join(conf.paths.app, '/**/*.scss')
  ], ['refresh']);

});
