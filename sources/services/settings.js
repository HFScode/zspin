'use strict'

var fs        = require('fs');
var gui       = require('nw.gui');
var mkdirp    = require('mkdirp');
var iniparser = require('iniparser');
var $path     = require('path');

var app = angular.module('app');
var APP_ROOT = $path.join(gui.App.dataPath, 'Zspin');
var INI_ROOT = $path.join(APP_ROOT, 'Settings');
mkdirp.sync(INI_ROOT);


app.factory('settings', [ 
  function () {
    return {
      // Set root paths
      root: INI_ROOT,
      appRoot: APP_ROOT,

      // Actual ini parsing
      parse: function(name) {
        var filename = name + '.ini';
        console.log('filename: %s', filename);
        var filepath = $path.join(INI_ROOT, filename);
        console.log('filepath: %s', filepath);

        var config = iniparser.parseSync(filepath);
        console.log('config:', config);
        return config;
      }
    }
  }
]);
