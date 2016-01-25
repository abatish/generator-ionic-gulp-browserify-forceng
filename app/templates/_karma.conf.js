'use strict';

var gulp = require('gulp');
var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');

function listFiles() {
  return [
    path.join(conf.paths.src, '/**/*.js'),
    path.join(conf.paths.npm, '/angular-mocks/angular-mocks.js')
  ];
}

module.exports = function(config) {

  var configuration = {
    files: listFiles(),

    frameworks: ['browserify', 'jasmine'],

    angularFilesort: {
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
    },

    reporters: ['coverage', 'progress'],

    // optionally, configure the reporter
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'gulpAngular'
    },

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-browserify'
    ],

    preprocessors: {
      'src/app/**/!(*spec|*mock).js': ['coverage'],
      'src/app/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: ['browserify-ng-html2js']
    }
  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
