var gulp = require('gulp'),
    path = require('path'),
    conf = require('./conf'),
    browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['build'], function () {
  // refresh the browser if any of the built
  // files change
  gulp.watch([
    path.join(conf.paths.build, '**/*.css'),
    path.join(conf.paths.build, '**/*.js')
  ], ['refresh']);

  // rebuild sass stylesheets
  gulp.watch([
    path.join(conf.paths.app, '/**/*.scss')
  ], ['styles']);

  // recompile templateCache
  gulp.watch([
    path.join(conf.paths.app, '/**/*.html')
  ], ['scripts']);

  // re-inject and copy index.html
  gulp.watch([
    path.join(conf.paths.src, '*.html')
  ], ['inject']);
});
