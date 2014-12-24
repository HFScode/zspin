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
        var args = [fs].concat([].slice.call(arguments, 0));
        var func = fs.readFile.bind.apply(fs.readFile, args);
        wrapCallback(defer, func);
        return defer.promise;
      },
      writeFile: function() {
        var defer = $q.defer();
        var args = [fs].concat([].slice.call(arguments, 0));
        var func = fs.writeFile.bind.apply(fs.writeFile, args);
        wrapCallback(defer, func);
        return defer.promise;
      },
      mkdir: function() {
        var defer = $q.defer();
        var args = [fs].concat([].slice.call(arguments, 0));
        var func = mkdirp.bind.apply(mkdirp, args);
        wrapCallback(defer, func);
        return defer.promise;
      },
      mktmpfile: function() {
        var defer = $q.defer();
        var args = [tmp].concat([].slice.call(arguments, 0));
        var func = tmp.file.bind.apply(tmp.file, args);
        wrapCallback(defer, func);
        return defer.promise;
      }


    };

  }
]);
