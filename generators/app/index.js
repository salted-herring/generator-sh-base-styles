'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {

    this.log(yosay(
      'Welcome to the amazing ' + chalk.red('generator-sh-base-styles') + ' generator!'
    ));

    console.log(chalk.red('First we need to set up the Grid.'));

    var prompts = [{
        type    : 'input',
        name    : 'grid_width',
        message : 'What\'s the width of your grid?',
        store   : true,
        default : 960
      },
      {
        type    : 'input',
        name    : 'number_columns',
        message : 'How many columns is your grid?',
        store   : true,
        default : 12
      },
      {
        type    : 'input',
        name    : 'gutter_width',
        message : 'How wide are your gutters?',
        store   : true,
        default : 20
      }
    ];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      var grid = props;

      var width = props.grid_width - (props.number_columns * props.gutter_width);
      width /= props.number_columns;

      var gutters = props.gutter_width / width;

      grid.column_width = width;
      grid.gutter_ratio = gutters;

      this.config.set('grid', grid);
      this.config.save();
    }.bind(this));
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

    this.fs.copy(
      this.templatePath('.ruby-version'),
      this.destinationPath('.ruby-version')
    );

    /**
     * Set up the grunt file.
     * */
    var _config = {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'scss/config/',
            src: '_variables.scss',
            dest: 'scss/config/'
          }
        ],
        options: {
          replacements: [
            {
                pattern: "containerwidthpx",
                replacement: '%width'
            },
            {
                pattern: "columnstotal",
                replacement: '%columns'
            },
            {
                pattern: "columnwidthpx",
                replacement: '%columnwidthpx'
            },
            {
                pattern: "gutterwidthpx",
                replacement: '%gutterwidthpx'
            },
            {
                pattern: "gutterratio",
                replacement: '%gutterratio'
            },
            {
                pattern: "maxwidthpx",
                replacement: '%maxwidthpx'
            },
            {
                pattern: "maxwidthpx1",
                replacement: '%maxwidthpx1'
            },
          ]
        }
      }
    };

    var _json = JSON.stringify(_config),
      max_width = (this.config.get('grid').grid_width - 1) + 'px';

    _json = _json.replace('%width', this.config.get('grid').grid_width);
    _json = _json.replace('%columns', this.config.get('grid').number_columns);
    _json = _json.replace('%columnwidthpx', this.config.get('grid').column_width);
    _json = _json.replace('%gutterwidthpx', this.config.get('grid').gutter_width);
    _json = _json.replace('%gutterratio', this.config.get('grid').gutter_ratio);
    _json = _json.replace('%maxwidthpx', max_width);
    _json = _json.replace('%maxwidthpx1', max_width);

    this.gruntfile.insertConfig('\'string-replace\'', _json);
    this.gruntfile.loadNpmTasks('grunt-string-replace');
    this.gruntfile.registerTask('build', 'string-replace');
  },

  install: function () {
    this.installDependencies({
      callback: function() {
        console.log(chalk.gray('Writing the grid config...'));
        this.spawnCommand('grunt', ['build']);
      }.bind(this)
    });
  },

  end: function() {
    console.log(chalk.green('✔ Grid config updated!'));
  }
});
