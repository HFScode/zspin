'use strict'

app.factory('fs', ['$q', 
  function ($q) {
    var fs = require('fs');
    var path = require('path');
    var tmp = require('tmp');
    var mkdirp = require('mkdirp');



    return {
      join: function() {
        return path.join.apply(path, arguments);
      },
      readFile: function() {
        var defer = $q.defer();
        wrapCallback(defer, fs, fs.readFile, arguments);
        return defer.promise.then(function(args) {
          return args[0];
        });
      },
      writeFile: function() {
        var defer = $q.defer();
        wrapCallback(defer, fs, fs.writeFile, arguments);
        return defer.promise;
      },
      mkdir: function() {
        var defer = $q.defer();
        wrapCallback(defer, null, mkdirp, arguments);
        return defer.promise;
      },
      stat: function() {
        var defer = $q.defer();
        wrapCallback(defer, fs, fs.stat, arguments);
        return defer.promise;
      },
      mktmpfile: function() {
        var defer = $q.defer();
        wrapCallback(defer, tmp, tmp.file, arguments);
        return defer.promise.then(function(args) {
          return {path: args[0], fd: args[1], clean: args[2]};
        });
      }


    };

  }
]);
