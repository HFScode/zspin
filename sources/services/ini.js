'use strict';

app.factory('ini', ['zspin', 'fs',
  function (zspin, fs) {
    console.log('ini - init');
    var ini = require('ini');

    var service = {
      // Actual ini parsing
      parse: function(filepath) {
        return fs.readFile(filepath, 'utf-8').then(function(data) {
          return ini.parse(data);
        });
      }
    };
    console.log('ini - init');
    return service;
  }
]);
