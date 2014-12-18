'use strict'

app.factory('fs', ['$q', 'zspin', 
  function ($q, zspin) {
    var fs = require('fs');
    var mkdirp = require('mkdirp');

    return {
      readFile: function() {
        var d = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        var p = wrapCallback(d, fs.readFile, fs, args);
        return p;
      },
      mkdir: function() {
        var d = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        var p = wrapCallback(d, mkdirp, mkdirp, args);
        return p;
      }
    };

  }
]);
