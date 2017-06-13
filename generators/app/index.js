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
      },
      {
        type    : 'input',
        name    : 'show_debug',
        message : 'Show grid debug? (Y/N)',
        store   : true,
        default : 'Y'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      var grid = props;

      console.log(chalk.red('Grid setup complete'));

      var width = props.grid_width - (2 * props.number_columns * (props.gutter_width/2));
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

    // this.fs.copy(
    //   this.templatePath('config.rb'),
    //   this.destinationPath('config.rb')
    // );

    // this.fs.copy(
    //   this.templatePath('Gemfile'),
    //   this.destinationPath('Gemfile')
    // );

    // this.fs.copy(
    //   this.templatePath('watcher-compass.sh'),
    //   this.destinationPath('watcher-compass.sh')
    // );

    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json')
    );

    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    // this.fs.copy(
    //   this.templatePath('.ruby-version'),
    //   this.destinationPath('.ruby-version')
    // );

    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    );

    this.fs.copy(
      this.templatePath('bower.json'),
      this.destinationPath('bower.json')
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
            src: ['_variables.scss', '_grid.scss'],
            dest: 'scss/config/'
          }
        ],
        options: {
          replacements: [
            {
                pattern: "containerwidth",
                replacement: '%width'
            },
            {
                pattern: "columnstotal",
                replacement: '%columns'
            },
            {
                pattern: "columnwidth",
                replacement: '%columnwidthpx'
            },
            {
                pattern: "gutterwidth",
                replacement: '%gutterwidthpx'
            },
            {
                pattern: "gutterratio",
                replacement: '%gutterratio'
            },
            {
                pattern: "maxwidth",
                replacement: '%maxwidthpx'
            },
            {
                pattern: "maxwidth1",
                replacement: '%maxwidthpx1'
            },
            {
              pattern: "showdebug",
              replacement: '%showdebug'
            }
          ]
        }
      }
    };

    var _json = JSON.stringify(_config),
      max_width = (this.config.get('grid').grid_width - 1),
      show_debug = this.config.get('grid').show_debug.toLowerCase();

    show_debug = show_debug == 'y' ? 'show' : 'hide';

    _json = _json.replace('%width', this.config.get('grid').grid_width);
    _json = _json.replace('%columns', this.config.get('grid').number_columns);
    _json = _json.replace('%columnwidthpx', this.config.get('grid').column_width);
    _json = _json.replace('%gutterwidthpx', this.config.get('grid').gutter_width);
    _json = _json.replace('%gutterratio', this.config.get('grid').gutter_ratio);
    _json = _json.replace('%maxwidthpx', max_width);
    _json = _json.replace('%maxwidthpx1', max_width);
    _json = _json.replace('%showdebug', show_debug);

    this.gruntfile.insertConfig('\'string-replace\'', _json);
    this.gruntfile.loadNpmTasks('grunt-string-replace');
    this.gruntfile.registerTask('grid', ['string-replace']);

  },

  install: function () {
    this.installDependencies({
      callback: function() {
        this.spawnCommand('grunt', ['grid']);
        this.spawnCommand('gulp', ['sass']);
      }.bind(this)
    });
  },

  end: function() {
  }
});
