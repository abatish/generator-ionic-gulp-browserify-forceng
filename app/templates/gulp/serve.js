var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    conf = require('./conf'),
    proxyMiddleware = require('http-proxy-middleware');


exports.bsInstance = browserSync;

function initServer(baseDir, browser, callback) {
  browser = browser === undefined ? 'default' : browser;

  var routes = {};
  var idProxy = proxyMiddleware(
    '/id',
    {
      target: '<%= sfLoginUrl %>',
      changeOrigin: true,
      logLevel: 'debug'
    }
  );

  var servicesProxy = proxyMiddleware(
    '/services',
    {
      target: '<%= sfLoginUrl %>',
      changeOrigin: true,
      logLevel: 'debug'
    }
  );

  browserSync.init({
    browser: browser,
    server: {
      baseDir: baseDir,
      routes: routes,
      port: process.env.PORT || 3000,
      middleware: [ idProxy, servicesProxy ]
    }
  }, callback);
}

gulp.task('refresh', [], function(callback) {
  browserSync.reload();
  callback();
});

gulp.task('serve:close', function () {
})

gulp.task('serve', ['watch'], function (done) {
  initServer(conf.paths.build, 'default', done);
});

gulp.task('serve:e2e', ['package'], function (done) {
  initServer(conf.paths.build, [], done);
});
