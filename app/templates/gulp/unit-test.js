var path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),
    scripts = require('./scripts');

var Server = require('karma').Server;

function runTests (singleRun, done) {
    var server = new Server({
        configFile: path.join(__dirname, '/../karma.conf.js'),
        singleRun: true,
        autoWatch: false
      }, function() {
        done(); 
      })

    server.start();
}

gulp.task('test', [], function(done) {
  return runTests(true, done);
});
