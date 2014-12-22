'use strict';

app.factory('ini', ['zspin', 'fs',
  function (zspin, fs) {
    var ini = require('ini');

    return {

      // Actual ini parsing
      parse: function(filepath) {
        filepath = fs.join(zspin.dataPath, filepath);
        return fs.readFile(filepath, 'utf-8').then(function(data) {
          return ini.parse(data);
        });
      }

    };
  }
]);
