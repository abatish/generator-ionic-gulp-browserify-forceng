var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    conf = require('./conf'),
    proxyMiddleware = require('http-proxy-middleware');

function initServer(baseDir) {
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
    server: {
      baseDir: baseDir,
      routes: routes,
      middleware: [ idProxy, servicesProxy ]
    }
  });
}

gulp.task('refresh', ['scripts', 'styles'], browserSync.reload);

gulp.task('serve', ['watch'], function () {
  return initServer(conf.paths.build);
});
