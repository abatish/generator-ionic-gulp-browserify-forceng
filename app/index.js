'use strict';
var yeoman = require( 'yeoman-generator' );
var chalk  = require( 'chalk' );
var yosay  = require( 'yosay' );
var path   = require( 'path'  );

var appPath = path.join(process.cwd(), 'app');

var options = {
  app: 'src/app',
  src: 'src'
};

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: {

    askForNames: function askForNames() {
      var done = this.async();

      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the ' + chalk.red('ionic-gulp') + ' generator. Let\'s build an ionic app, shall we?'
      ));

      var prompts = [{
        type: 'input',
        name: 'appName',
        message: 'What\'s the app name?',
        default : this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'userName',
        message: 'The author\'s name? (for config files)',
        default : this.user.git.name || 'Your Name'
      },
      {
        type: 'input',
        name: 'userMail',
        message: 'Author email? (for config files)',
        default : this.user.git.email || 'email@example.com'
      },
      {
        type: 'input',
        name: 'sfAppId',
        message: 'Salesforce Connected App ID?'
      },
      {
        type: 'input',
        name: 'sfApiVersion',
        message: 'Salesforce API Version?',
        default: 'v32.0'
      },
      {
        type: 'input',
        name: 'sfLoginUrl',
        message: 'Salesforce Login Url?',
        default: 'https://login.salesforce.com'
      }];

      this.prompt(prompts, function(props) {
        this.appName = props.appName;
        this.userName = props.userName;
        this.userMail = props.userMail;
        this.sfAppId = props.sfAppId;
        this.sfApiVersion = props.sfApiVersion;
        this.sfLoginUrl = props.sfLoginUrl;

        done();
      }.bind(this));
    },

    askForAppId: function askForAppId() {
      var done = this.async();
      this.prompt([{
        type: 'input',
        name: 'appId',
        message: 'The app id?',
        default : 'com.incapsulate.' + this._.classify(this.appName).toLowerCase()
      }], function (props) {
        this.appId = props.appId;
        done();
      }.bind(this));
    }

  },

  writing: {

    setup: function () {

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { appName: this._.underscored(this.appName),
          userName: this.userName,
          userEmail: this.userMail }
      );
      this.fs.copyTpl(
        this.templatePath('ionic.project'),
        this.destinationPath('ionic.project'),
        { appName: this._.underscored(this.appName) }
      );
      this.fs.copyTpl(
        this.templatePath('_config.xml'),
        this.destinationPath('config.xml'),
        { appName: this.appName,
          userName: this.userName,
          userEmail: this.userMail,
          widgetId: this.appId }
      );

      this.fs.copyTpl(
        this.templatePath( '_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        { ngModulName: this._.classify(this.appName),
          userName: this.userName,
          userEmail: this.userMail }
      );

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );

      this.mkdir('helpers');
      this.mkdir('www');

      this.fs.copy(
        this.templatePath('helpers/emulateios'),
        this.destinationPath('helpers/emulateios')
      );

      this.mkdir('gulp');
      this.fs.copy(
        this.templatePath('gulp/build.js'),
        this.destinationPath('gulp/build.js')
      );
      this.fs.copy(
        this.templatePath('gulp/conf.js'),
        this.destinationPath('gulp/conf.js')
      );
      this.fs.copy(
        this.templatePath('gulp/ionic.js'),
        this.destinationPath('gulp/ionic.js')
      );
      this.fs.copyTpl(
        this.templatePath('gulp/scripts.js'),
        this.destinationPath('gulp/scripts.js'),
        { ngModulName: this._.classify(this.appName) }
      );
      this.fs.copy(
        this.templatePath('gulp/styles.js'),
        this.destinationPath('gulp/styles.js')
      );
      this.fs.copyTpl(
        this.templatePath('gulp/serve.js'),
        this.destinationPath('gulp/serve.js'),
        { sfLoginUrl : this.sfLoginUrl }
      );
      this.fs.copy(
        this.templatePath('gulp/watch.js'),
        this.destinationPath('gulp/watch.js')
      );

    },

    projectfiles: function () {
      this.directory('app', 'app');
      this.directory('hooks', 'hooks');

      this.mkdir('app/icons');
      this.mkdir('app/images');
      this.mkdir('resources');

      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath(path.join(options.src, 'index.html')),
        { title: this.appName, ngModulName: this._.classify(this.appName)  }
      );

      // app
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, 'app.js')),
        this.destinationPath(path.join(options.app, 'app.js')),
        { ngModulName: this._.classify(this.appName) }
      );
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, 'app.config.js')),
        this.destinationPath(path.join(options.app, 'app.config.js')),
        { ngModulName: this._.classify(this.appName) }
      );
      this.fs.copy(
        this.templatePath(path.join(options.src, 'app.scss')),
        this.destinationPath(path.join(options.app, 'app.scss'))
      );
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, 'app.run.js')),
        this.destinationPath(path.join(options.app, 'app.run.js')),
        { sfAppId: this.sfAppId, sfApiVersion: this.sfApiVersion, sfLoginUrl: this.sfLoginUrl }
      );
      this.fs.copy(
        this.templatePath(path.join(options.src, 'app.routes.js')),
        this.destinationPath(path.join(options.app, 'app.routes.js'))
      );

      // components
      var homeController = '/home/homeController.js';
      this.fs.copyTpl(
        this.templatePath(options.src + homeController),
        this.destinationPath(options.app + homeController),
        { ngModulName: this._.classify(this.appName) }
      );

      var homeHtml = '/home/home.html';
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, homeHtml)),
        this.destinationPath(path.join(options.app, homeHtml)),
        { title: this.appName }
      );

      var mainController = '/main/mainController.js';
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, mainController)),
        this.destinationPath(path.join(options.app, mainController)),
        { ngModulName: this._.classify(this.appName) }
      );
      var mainHtml = '/main/main.html';
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, mainHtml)),
        this.destinationPath(path.join(options.app, mainHtml)),
        { title: this.appName }
      );

      var settingsController = '/settings/settingsController.js';
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, settingsController)),
        this.destinationPath(path.join(options.app, settingsController)),
        { ngModulName: this._.classify(this.appName) }
      );
      var settingsHtml = '/settings/settings.html';
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, settingsHtml)),
        this.destinationPath(path.join(options.app, settingsHtml)),
        { title: this.appName }
      );

      // shared
      var exampleService = '/components/example/ExampleService.js';
      this.fs.copyTpl(
        this.templatePath(path.join(options.src, exampleService)),
        this.destinationPath(path.join(options.app, exampleService)),
        { ngModulName: this._.classify(this.appName) }
      );

      this.fs.copy(
        this.templatePath('splash.png'),
        this.destinationPath('resources/splash.png')
      );

      this.fs.copy(
        this.templatePath('icon.png'),
        this.destinationPath('resources/icon.png')
      );
    }

  },

  install: function () {
    this.installDependencies({
      skipInstall: options['skip-install'],
      bower: false
      //, npm: false
    });
  }
});
