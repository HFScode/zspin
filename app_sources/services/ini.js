'use strict';

app.factory('ini', ['zspin', 'fs',
  function (zspin, fs) {
    console.log('ini - init');
    var ini = require('ini');

    //  -  Services for ini-file parsing  -
    var service = {

      parse: function(filepath) {
        return fs.readFile(filepath, 'utf-8').then(function(data) {
          return ini.parse(data);
        });
      }

    };
    console.log('ini - ready');
    return service;
  }
]);
