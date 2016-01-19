'use strict';

var appName = '<%= ngModulName %>';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var beep = require('beepbeep');
var express = require('express');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var ripple = require('ripple-emulator');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var wiredep = require('wiredep');

/**
 * Parse arguments
 */
var args = require('yargs')
    .alias('e', 'emulate')
    .alias('b', 'build')
    .alias('r', 'run')
    // remove all debug messages (console.logs, alerts etc) from release build
    .alias('release', 'strip-debug')
    .default('build', false)
    .default('port', 9000)
    .default('strip-debug', false)
    .default('platform', 'android')
    .argv;

var options = {
  build: !!(args.build || args.emulate || args.run),
  emulate: args.emulate,
  run: args.run,
  port: args.port,
  stripDebug: !!args.stripDebug,
  platform: args.platform,

  app: './src/app/',
  src: './src/',
  dist: './www/',
  tmp: './.tmp/',
  node_modules: './node_modules/'
};

options.targetDir = path.resolve(options.build ? 'www' : '.tmp');

// if we just use emualate or run without specifying platform, we assume iOS
// in this case the value returned from yargs would just be true
if (options.emulate === true) {
    options.emulate = platform;
}
if (options.run === true) {
    options.run = platform;
}

// global error handler
var errorHandler = function(error) {
  if (options.build) {
    throw error;
  } else {
    beep(2, 170);
    $.util.log(error);
  }
};


// clean target dir
gulp.task('clean', function(done) {
  return del([targetDir, 'app/scripts/bundle.js', 'app/scripts/bundle.js.map'], done);
});

// precompile .scss and concat with ionic.css
gulp.task('styles', function() {

  var options = options.build ? { style: 'compressed' } : { style: 'expanded' };

  var sassStream = gulp.src('app/styles/main.scss')
    .pipe($.sass(options))
    .on('error', function(err) {
      console.log('err: ', err);
      beep();
    });

  // build ionic css dynamically to support custom themes
  var ionicStream = gulp.src('app/styles/ionic-styles.scss')
    .pipe($.cached('ionic-styles'))
    .pipe($.sass(options))
    // cache and remember ionic .scss in order to cut down re-compile time
    .pipe($.remember('ionic-styles'))
    .on('error', function(err) {
        console.log('err: ', err);
        beep();
      });

  return streamqueue({ objectMode: true }, ionicStream, sassStream)
    .pipe($.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
    .pipe($.concat('main.css'))
    .pipe($.if(options.build, $.stripCssComments()))
    .pipe($.if(options.build && !options.emulate, $.rev()))
    .pipe(gulp.dest(path.join(targetDir, 'styles')))
    .on('error', errorHandler);
});

// bundle all the src files into scripts/bundle.js
gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './app/src/app.js',
    debug: !options.build
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      .pipe($.uglify())
      .on('error', $.gutil.log)
    .pipe($.if(!options.build, $.sourcemaps.write('./')))
    .pipe(gulp.dest('./app/scripts/'));
});

// build templatecache, copy scripts.
// if build: concat, minsafe, $.uglify and versionize
gulp.task('scripts', ['browserify'], function() {
  var dest = path.join(targetDir, 'scripts');

  var minifyConfig = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeComments: true
  };

  // prepare angular template cache from html templates
  // (remember to change appName var to desired module name)
  var templateStream = gulp
    .src('**/*.html', { cwd: 'app/templates'})
    .pipe($.angularTemplatecache('templates.js', {
      root: 'templates/',
      module: appName,
      htmlmin: options.build && minifyConfig
    }));

  var scriptStream = gulp
    .src( ['bundle.js', 'bundle.js.map', 'configuration.js', 'templates.js' ], { cwd: 'app/scripts' })

    .pipe($.if(!options.build, $.changed(dest)));

  return streamqueue({ objectMode: true }, scriptStream, templateStream)
    .pipe($.if(options.build, $.ngAnnotate()))
    .pipe($.if(stripDebug, $.stripDebug()))
    .pipe($.if(options.build, $.concat('app.js')))
    .pipe($.if(options.build, $.$.uglify()))
    .pipe($.if(options.build && !options.emulate, $.rev()))

    .pipe(gulp.dest(dest))

    .on('error', errorHandler);
});

// copy fonts
gulp.task('fonts', function() {
  return gulp
    .src(['app/fonts/*.*', 'bower_components/ionic/release/fonts/*.*'])

    .pipe(gulp.dest(path.join(targetDir, 'fonts')))

    .on('error', errorHandler);
});



// generate iconfont
gulp.task('iconfont', function(){
  return gulp.src('app/icons/*.svg', {
        buffer: false
    })
    .pipe($.iconfontCss({
      fontName: 'ownIconFont',
      path: 'app/icons/own-icons-template.css',
      targetPath: '../styles/own-icons.css',
      fontPath: '../fonts/'
    }))
    .pipe($.iconfont({
        fontName: 'ownIconFont'
    }))
    .pipe(gulp.dest(path.join(targetDir, 'fonts')))
    .on('error', errorHandler);
});

// copy images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.*')
    .pipe(gulp.dest(path.join(targetDir, 'images')))

    .on('error', errorHandler);
});


// lint js sources based on .jshintrc ruleset
gulp.task('jsHint', function() {
  return gulp
    .src('app/src/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .on('error', errorHandler);
});

// concatenate and minify vendor sources
gulp.task('vendor', function() {
  var vendorFiles = wiredep().js;

  return gulp.src(vendorFiles)
    .pipe($.concat('vendor.js'))
    .pipe($.if(options.build, $.$.uglify()))
    .pipe($.if(options.build, $.rev()))

    .pipe(gulp.dest(targetDir))

    .on('error', errorHandler);
});


// inject the files in index.html
gulp.task('index', ['jsHint', 'scripts'], function() {

  // build has a '-versionnumber' suffix
  var cssNaming = 'styles/main*';

  // injects 'src' into index.html at position 'tag'
  var _inject = function(src, tag) {
    return $.inject(src, {
      starttag: '<!-- inject:' + tag + ':{{ext}} -->',
      read: false,
      addRootSlash: false
    });
  };

  // get all our javascript sources
  // in development mode, it's better to add each file seperately.
  // it makes debugging easier.
  var _getAllScriptSources = function() {
    var scriptStream = gulp.src(['scripts/app.js', 'scripts/**/*.js'], { cwd: targetDir });
    return streamqueue({ objectMode: true }, scriptStream);
  };

  return gulp.src('app/index.html')
    // inject css
    .pipe(_inject(gulp.src(cssNaming, { cwd: targetDir }), 'app-styles'))
    // inject vendor.js
    .pipe(_inject(gulp.src('vendor*.js', { cwd: targetDir }), 'vendor'))
    // inject app.js (build) or all js files indivually (dev)
    .pipe($.if(options.build,
      _inject(gulp.src('scripts/app*.js', { cwd: targetDir }), 'app'),
      _inject(_getAllScriptSources(), 'app')
    ))

    .pipe(gulp.dest(targetDir))
    .on('error', errorHandler);
});

// start local express server
gulp.task('serve', function() {
  express()
    .use(!options.build ? connectLr() : function(){})
    .use(express.static(targetDir))
    .listen(options.port);

  open('http://localhost:' + options.port + '/');
});

// ionic emulate wrapper
gulp.task('ionic:emulate', $.shell.task([
  'ionic emulate ' + options.emulate + ' --livereload --consolelogs'
]));

// ionic run wrapper
gulp.task('ionic:run', $.shell.task([
  'ionic run ' + options.run
]));

// ionic resources wrapper
gulp.task('icon', $.shell.task([
  'ionic resources --icon'
]));
gulp.task('splash', $.shell.task([
  'ionic resources --splash'
]));
gulp.task('resources', $.shell.task([
  'ionic resources'
]));

// ripple emulator
gulp.task('ripple', ['scripts', 'styles', 'watchers'], function() {

  var options = {
    keepAlive: false,
    open: true,
    port: 4400
  };

  // Start the ripple server
  ripple.emulate.start(options);

  open('http://localhost:' + options.port + '?enableripple=true');
});


// start watchers
gulp.task('watchers', function() {
  $.livereload.listen();
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**', ['fonts']);
  gulp.watch('app/icons/**', ['iconfont']);
  gulp.watch('app/images/**', ['images']);
  gulp.watch(['app/scripts/**/*.js','!app/scripts/bundle.js'], ['index']);
  gulp.watch('./bower.json', ['vendor']);
  gulp.watch('app/templates/**/*.html', ['index']);
  gulp.watch('app/index.html', ['index']);
  gulp.watch('app/src/**/*.js', ['scripts']);
  gulp.watch(targetDir + '/**')
    .on('change', $.livereload.changed)
    .on('error', errorHandler);
});

// no-op = empty function
gulp.task('noop', function() {});

// our main sequence, with some conditional jobs depending on params
gulp.task('default', function(done) {
  runSequence(
    'clean',
    'iconfont',
    [
      'fonts',
      'styles',
      'images',
      'vendor'
    ],
    'index',
    options.build ? 'noop' : 'watchers',
    options.build ? 'noop' : 'serve',
    options.emulate ? ['ionic:emulate', 'watchers'] : 'noop',
    options.run ? 'ionic:run' : 'noop',
    done);
});
