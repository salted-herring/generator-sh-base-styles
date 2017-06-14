'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-sh-base-styles:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true})
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      'gulpfile.js',
      'index.html',
      'bower.json'
    ]);
  });

  it('removes grunt file', function() {
    assert.noFile(['Gruntfile.js']);
  })
});
