var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'gulp.*', 'vinyl-*']
    }),
    path = require('path'),
    browserSync = require('browser-sync'),
    browserify = require('browserify'),
    ngHtml2Js = require('browserify-ng-html2js'),
    watchify = require('watchify'),
    conf = require('./conf');

var ng2HtmlConfig = {
  module: '<%= ngModulName %>',
  extension: 'html',
  baseDir: conf.paths.app
};

var b = watchify(browserify({
  basedir: conf.paths.src,
  entries: ['app/app.js'],
  debug: true,
  cache: {},
  packageCache: {}
}));

exports.watchify = b;

b.transform(ngHtml2Js(ng2HtmlConfig))
b.on('log', conf.logHandler('Watchify'));
b.on('update', bundle);

function bundle() {
  return b.bundle()
    .on('error', conf.errorHandler('Browserify'))
    .pipe($.vinylSourceStream('bundle.js'))
    .pipe($.vinylBuffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
      .on('error', conf.errorHandler('Sourcemaps'))
      .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(path.join(conf.paths.build, 'app')))
    .pipe(browserSync.stream());
}

gulp.task('scripts', [], function () {
  return bundle();
});
