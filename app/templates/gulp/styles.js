var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'gulp.*', 'vinyl-*']
    }),
    path = require('path'),
    conf = require('./conf');


gulp.task('sass', [], function () {
  var injectFiles = gulp.src([
    path.join(conf.paths.app, '**/*.scss'),
    '!' + path.join(conf.paths.app, 'app.scss')
  ]);

  var injectOptions = {
    transform: function (filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var sassOptions = {
    style: 'expanded'
  };

  return gulp.src(path.join(conf.paths.app, 'app.scss'))
    .pipe($.inject(injectFiles, injectOptions))
    .pipe($.sass(sassOptions).on('error', conf.errorHandler('Sass')))
    .pipe($.if(conf.prod, $.cssnano()))
    .pipe(gulp.dest(path.join(conf.paths.dist, 'app')));
})
