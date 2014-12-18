'use strict'

app.factory('settings', ['zspin',
  function (zspin) {
    var fs = require('fs');
    var path = require('path');
    var mkdirp = require('mkdirp');
    var iniparser = require('iniparser');

    // init
    var dataPath = zspin.dataPath;
    var settingsPath = path.join(dataPath, 'Settings');
    mkdirp.sync(settingsPath);

    return {
      // Set root paths
      root: settingsPath,

      // Actual ini parsing
      parse: function(name) {
        var filename = name + '.ini';
        var filepath = path.join(settingsPath, filename);
        return iniparser.parseSync(filepath);
      }
    };
  }
]);
