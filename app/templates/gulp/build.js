var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    del = require('del'),
    browserSync = require('browser-sync'),
    conf = require('./conf'),
    runSequence = require('run-sequence');


gulp.task('inject', ['scripts', 'styles'], function () {
  var srcs = gulp.src([
    path.join(conf.paths.build, '**/*.js'),
    path.join(conf.paths.build, '**/*.css')
  ]);


  return gulp.src(path.join(conf.paths.src, 'index.html'))
    .pipe($.inject(srcs, {ignorePath: conf.paths.build, addRootSlash: false}))
    .pipe(gulp.dest(path.join(conf.paths.build)));
});

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('clean', [], function () {
  return del([conf.paths.dist, conf.paths.build]);
});

gulp.task('build', [], function (callback) {
  runSequence('clean', ['inject', 'fonts', 'copy'], callback);
});

gulp.task('copy', [], function () {
  return gulp.src(path.join(conf.paths.src, 'oauth.html'))
    .pipe(gulp.dest(conf.paths.build));
});
