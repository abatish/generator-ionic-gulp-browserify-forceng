var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'gulp.*', 'vinyl-*']
    }),
    path = require('path'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    conf = require('./conf');

var b = watchify(browserify({
  basedir: conf.paths.src,
  entries: ['app/app.js'],
  debug: true,
  plugin: [],
  cache: {},
  packageCache: {}
}));

b.on('log', conf.logHandler('Watchify'));
b.on('update', bundle);

function bundle() {
  return b.bundle()
    .on('error', conf.errorHandler('Browserify'))
    .pipe($.vinylSourceStream('bundle.js'))
    .pipe(gulp.dest(path.join(conf.paths.dist, 'src')));
}

gulp.task('scripts', [], function () {
  return bundle();
});
