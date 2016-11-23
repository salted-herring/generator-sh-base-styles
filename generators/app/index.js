'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    this.config.save();
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the amazing ' + chalk.red('generator-sh-base-styles') + ' generator!'
    ));

/*
    var prompts = [{
      type: 'confirm',
      name: 'someAnswer',
      message: 'Would you like to enable this option?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
*/
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('scss'),
      this.destinationPath('scss')
    );

    this.fs.copy(
      this.templatePath('config.rb'),
      this.destinationPath('config.rb')
    );

    this.fs.copy(
      this.templatePath('Gemfile'),
      this.destinationPath('Gemfile')
    );

    this.fs.copy(
      this.templatePath('watcher-compass.sh'),
      this.destinationPath('watcher-compass.sh')
    );

    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json')
    );

    this.fs.copy(
      this.templatePath('bower.json'),
      this.destinationPath('bower.json')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
