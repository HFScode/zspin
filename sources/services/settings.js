'use strict'

app.factory('settings', ['zspin', 'fs',
  function (zspin, fs) {
    var ini = require('ini');
    var path = require('path');
    var mkdirp = require('mkdirp');

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
        return fs.readFile(filepath, 'utf-8').then(function(data) {
          return ini.parse(data);
        });
      }
    };
  }
]);
