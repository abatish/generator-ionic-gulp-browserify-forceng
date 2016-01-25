var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    browserify = require('browserify'),
    runSequence = require('run-sequence'),
    conf = require('./conf'),
    scripts = require('./scripts');

gulp.task('package', ['build'], function () {

  scripts.watchify.close();

  var htmlFilter = $.filter('*.html', { restore: true });
  var codovaInjectOptions = {starttag: '<!-- inject:cordova:{{ext}} -->', relative: false, addRootSlash: false};

  return gulp.src([
    path.join(conf.paths.build, '**/*.js'),
    path.join(conf.paths.build, '**/*.css'),
    path.join(conf.paths.build, '**/*.+(eot|svg|ttf|woff)'),
    path.join(conf.paths.build, '*.html'),
    'config.xml'
  ])
  .pipe(htmlFilter)
  .pipe($.inject($.file('cordova.js', '', {src: true}), codovaInjectOptions))
  .pipe(htmlFilter.restore)
  .pipe(gulp.dest(conf.paths.dist))
});

gulp.task('ionic:emulate', ['package'], $.shell.task([
  'ionic emulate ' + conf.platform + ' --livereload --consolelogs'
], {interactive: true}));

gulp.task('ionic:run', ['package'], $.shell.task([
  'ionic run ' + conf.platform
]));

gulp.task('icon', ['package'], $.shell.task([
  'ionic resources --icon'
]));
gulp.task('splash', ['package'], $.shell.task([
  'ionic resources --splash'
]));
gulp.task('resources', ['package'], $.shell.task([
  'ionic resources'
]));
