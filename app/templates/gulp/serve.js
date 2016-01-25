var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    conf = require('./conf'),
    proxyMiddleware = require('http-proxy-middleware');

function initServer(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = {};
  var idProxy = proxyMiddleware(
    '/id',
    {
      target: 'https://test.salesforce.com',
      changeOrigin: true,
      logLevel: 'debug'
    }
  );

  var servicesProxy = proxyMiddleware(
    '/services',
    {
      target: 'https://test.salesforce.com',
      changeOrigin: true,
      logLevel: 'debug'
    }
  );
  browserSync.init({
    browser: browser,
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

gulp.task('serve:e2e', ['build'], function () {
  return initServer(conf.paths.build, []);
});
