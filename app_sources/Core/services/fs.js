'use strict'

app.factory('fs', ['$q',
  function ($q) {
    console.log('fs - init');
    var fs = require('fs');
    var path = require('path');
    var tmp = require('tmp');
    var glob = require('glob');
    var mkdirp = require('mkdirp');
    var rimraf = require('rimraf');

    //  -  Services for file system  -
    var service = {

      /*************************** Custom filters ****************************/

      extname: function(filename) {
        var str = filename.toLowerCase();
        return str.replace(/^.*\./, '');
      },

      basename: function (filename) {
        var str = path.basename(filename);
        return str.replace(/\..*?$/, '');
      },

      dirname: function (filename) {
        return path.dirname(filename);
      },


      // basenamelc: function (filename) {
      //   var str = path.basename(filename);
      //   str = str.toLowerCase();
      //   return str.replace(/\..*?$/, '');
      // },

      join: function() {
        return path.join.apply(path, arguments);
      },

      /********************** General Purpose Proxies  **********************/

      apply: function(funcname, args) {
        var defer = $q.defer();
        // console.log('apply', funcname, args);
        wrapErrCallback(defer, fs, fs[funcname], args);
        return defer.promise;
      },

      call: function(funcname) {
        var args = [].slice.call(arguments, 1);
        // console.log('call', funcname, args);
        return service.apply(funcname, args);
      },

      /*************************** Proxy functions ***************************/

      readdir: function() {
        function tr(args) { return args[0]; }
        return service.apply('readdir', arguments).then(tr);
      },

      readFile: function() {
        function tr(args) { return args[0]; }
        return service.apply('readFile', arguments).then(tr);
      },

      exists: function() {
        function tr(args) { return args[0]; }
        return service.apply('exists', arguments).then(tr);
      },

      F_OK: fs.F_OK, R_OK: fs.R_OK, W_OK: fs.W_OK, X_OK: fs.X_OK,
      access: function() {
        function tr(args) { return args[0]; }
        return service.apply('access', arguments).then(tr);
      },

      writeFile: function() {
        return service.apply('readFile', arguments);
      },

      /***************************** Other Tools *****************************/

      glob: function() {
        var defer = $q.defer();
        function tr(args) { return args[0]; }
        wrapErrCallback(defer, null, glob, arguments);
        return defer.promise.then(tr);
      },


      mkdir: function() {
        var defer = $q.defer();
        wrapErrCallback(defer, null, mkdirp, arguments);
        return defer.promise;
      },

      mktmpfile: function() {
        var defer = $q.defer();
        function tr(r) { return {path: r[0], fd: r[1], clean: r[2]}; }
        wrapErrCallback(defer, tmp, tmp.file, arguments);
        return defer.promise.then(tr);
      },

      mktmpdir: function() {
        var defer = $q.defer();
        function tr(r) { return {path: r[0], clean: r[2]}; }
        wrapErrCallback(defer, tmp, tmp.dir, arguments);
        return defer.promise.then(tr);
      },

      rmrf: function(path) {
        var defer = $q.defer();
        wrapErrCallback(defer, null, rimraf, arguments);
        return defer.promise;
      }

    };
    console.log('fs - ready');
    return service;
  }
]);
