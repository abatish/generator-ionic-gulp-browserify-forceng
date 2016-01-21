var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    conf = require('./conf');


gulp.task('inject', ['scripts', 'styles'], function () {
  var srcs = gulp.src([
    path.join(conf.paths.dist, '**/*.js'),
    path.join(conf.paths.dist, '**/*.css')
  ]);

  var codovaInjectOptions = {starttag: '<!-- inject:cordova:{{ext}} -->', relative: true};

  return gulp.src(path.join(conf.paths.src, 'index.html'))
    .pipe($.inject(srcs, {ignorePath: conf.paths.dist}))
    .pipe($.if(conf.prod, $.inject($.file('cordova.js', '', {src: true}), codovaInjectOptions)))
    .pipe($.if(conf.prod, $.stripComments()))
    .pipe(gulp.dest(path.join(conf.paths.dist)));
});
