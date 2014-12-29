'use strict'

app.factory('fs', ['$q', 
  function ($q) {
    console.log('fs - init');
    var fs = require('fs');
    var path = require('path');
    var tmp = require('tmp');
    var mkdirp = require('mkdirp');
    var rimraf = require('rimraf');

    var service = {
      join: function() {
        return path.join.apply(path, arguments);
      },
      readdir: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, fs, fs.readdir, arguments);
        return defer.promise.then(function(args) {
          return args[0];
        });
      },
      readFile: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, fs, fs.readFile, arguments);
        return defer.promise.then(function(args) {
          return args[0];
        });
      },
      writeFile: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, fs, fs.writeFile, arguments);
        return defer.promise;
      },
      mkdir: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, null, mkdirp, arguments);
        return defer.promise;
      },
      exists: function() {
        var defer = $q.defer();
        wrapCallback(defer, fs, fs.exists, arguments);
        return defer.promise.then(function(args) {
          return args[0];
        });
      },
      stat: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, fs, fs.stat, arguments);
        return defer.promise;
      },
      mktmpfile: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, tmp, tmp.file, arguments);
        return defer.promise.then(function(args) {
          return {path: args[0], fd: args[1], clean: args[2]};
        });
      },
      mktmpdir: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, tmp, tmp.dir, arguments);
        return defer.promise.then(function(args) {
          return {path: args[0], clean: args[2]};
        });
      },
      rmdir: function(path) {
        var defer = $q.defer();
        wrapErrCallback(defer, null, rimraf, arguments);
        return defer.promise;
      }
    };
    console.log('fs - ready');
    return service;
  }
]);
