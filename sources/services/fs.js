'use strict'

app.factory('fs', ['$q', 
  function ($q) {
    var fs = require('fs');
    var path = require('path');
    var mkdirp = require('mkdirp');

    return {
      join: function() {
        var args = Array.prototype.slice.call(arguments);
        return path.join.apply(path, args);
      },
      readFile: function() {
        var d = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        wrapCallback(d, fs.readFile, fs, args);
        return d.promise;
      },
      mkdir: function() {
        var d = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        wrapCallback(d, mkdirp, mkdirp, args);
        return d.promise;
      }
    };

  }
]);
