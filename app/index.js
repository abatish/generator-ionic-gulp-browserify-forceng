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

      }];

      this.prompt(prompts, function(props) {
        this.appName = props.appName;
        this.userName = props.userName;
        this.userMail = props.userMail;

        done();
      }.bind(this));
    },

    askForAppId: function askForAppId() {
      var done = this.async();
      this.prompt([{
        type: 'input',
        name: 'appId',
        message: 'The app id?',
        default : 'com.' + this._.classify(this.userName).toLowerCase() + '.' + this._.classify(this.appName).toLowerCase()
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
        { ngModulName: this._.classify(this.appName) }
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

    },

    projectfiles: function () {
      this.directory('app', 'app');
      this.directory('hooks', 'hooks');

      this.mkdir('app/icons');
      this.mkdir('app/images');
      this.mkdir('resources');

      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('app/index.html'),
        { title: this.appName, ngModulName: this._.classify(this.appName)  }
      );


      // app
      this.fs.copyTpl(
        this.templatePath('src/app.js'),
        this.destinationPath('src/app/app.js'),
        { ngModulName: this._.classify(this.appName) }
      );

      // components
      var homeController = '/components/home/homeController.js';
      this.fs.copyTpl(
        this.templatePath(options.src + homeController),
        this.destinationPath(options.app + homeController),
        { ngModulName: this._.classify(this.appName) }
      );

      var homeHtml = '/components/home/home.html';
      this.fs.copyTpl(
        this.templatePath(options.src + homeHtml),
        this.destinationPath(options.app + homeHtml),
        { title: this.appName }
      );

      var mainController = '/components/main/mainController.js';
      this.fs.copyTpl(
        this.templatePath(options.src + mainController),
        this.destinationPath(options.app + mainController),
        { ngModulName: this._.classify(this.appName) }
      );

      var settingsController = '/components/settings/settingsController.js';
      this.fs.copyTpl(
        this.templatePath(options.src + settingsController),
        this.destinationPath(options.app + settingsController),
        { ngModulName: this._.classify(this.appName) }
      );

      // shared
      var exampleService = '/shared/example/ExampleService.js';
      this.fs.copyTpl(
        this.templatePath(options.src + exampleService),
        this.destinationPath(options.app + exampleService),
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
      skipInstall: this.options['skip-install']
    });
  }
});
