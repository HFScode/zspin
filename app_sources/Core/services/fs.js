'use strict'

app.factory('fs', ['$q', 'qbind',
  function ($q, qbind) {
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

      filename: function (filename) {
        return path.basename(filename);
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

      /********************** General Purpose Proxies  ***********************/

      // apply: function(funcname, args) {
      //   var defer = $q.defer();
      //   // console.log('apply', funcname, args);
      //   qbind.wrapErrCallback(defer, fs, fs[funcname], args);
      //   return defer.promise;
      // },

      // call: function(funcname) {
      //   var args = [].slice.call(arguments, 1);
      //   // console.log('call', funcname, args);
      //   return service.apply(funcname, args);
      // },

      /*************************** Proxy functions ***************************/

      readdir: function() {
        return qbind.apply(fs, fs.readdir, arguments)
          .then(function(args) { return args[0]; } );
      },

      readFile: function() {
        return qbind.apply(fs, fs.readFile, arguments)
          .then(function(args) { return args[0]; } );
      },

      exists: function() {
        return qbind.apply(fs, fs.exists, arguments)
          .then(function(args) { return args[0]; } );
      },

      F_OK: fs.F_OK, R_OK: fs.R_OK, W_OK: fs.W_OK, X_OK: fs.X_OK,
      access: function() {
        return qbind.apply(fs, fs.access, arguments)
          .then(function(args) { return args[0]; } );
      },

      writeFile: function() {
        return qbind.apply(fs, fs.writeFile, arguments);
      },

      /***************************** Other Tools *****************************/

      glob: function() {
        return qbind.apply(null, glob, arguments)
          .then(function(args) { return args[0]; } );
      },

      mkdir: function() {
        return qbind.apply(null, mkdirp, arguments);
      },

      // mktmpfile: function() {
      //   return qbind.apply(tmp, tmp.file, arguments)
      //     .then(function(r) { return {path: r[0], fd: r[1], clean: r[2]}; });
      // },

      mktmpdir: function() {
        return qbind.apply(tmp, tmp.dir, arguments)
          .then(function(r) { return {path: r[0], clean: r[2]}; });
      },

      rmrf: function(path) {
        return qbind.apply(null, rimraf, arguments);
      }

    };
    console.log('fs - ready');
    return service;
  }
]);
