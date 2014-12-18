'use strict'

app.factory('fs', ['$q', 'zspin', 
  function ($q, zspin) {
    var fs = require('fs');
    var mkdirp = require('mkdirp');

    function wrapCallback(func, args) {
      var d = $q.defer();
      d.promise.$object = [];
      args.push(function (err, res) {
        if (err)
          d.reject(err);
        else
          d.resolve(res);
      });
      func.apply(fs, args);
      return d.promise;
    }

    return {
      readFile: function() {
        var args = Array.prototype.slice.call(arguments);
        var p = wrapCallback(fs.readFile, args);
        return p;
      }
    };

    // return function(path) {

      // // Set root paths
      // root: settingsPath,

      // // Actual ini parsing
      // parse: function(name) {
      //   var filename = name + '.ini';
      //   var filepath = path.join(settingsPath, filename);
      //   console.log(filepath);
      //   try {
      //     var file = fs.readFileSync(filepath, 'utf-8');
      //     return ini.parse(file);
      //   } catch (e) {
      //     return {};
      //   }
      // }
  }
]);
