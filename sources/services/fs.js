'use strict'

app.factory('fs', ['$q', 'zspin', 
  function ($q, zspin) {
    var fs = require('fs');
    var mkdirp = require('mkdirp');

    function wrapCallback(func, that, args) {
      var d = $q.defer();
      d.promise.$object = [];
      args.push(function (err, res) {
        if (err)
          d.reject(err);
        else
          d.resolve(res);
      });
      func.apply(that, args);
      return d.promise;
    }
    
    return {
      readFile: function() {
        var args = Array.prototype.slice.call(arguments);
        var p = wrapCallback(fs.readFile, fs, args);
        return p;
      }
    };

  }
]);
