'use strict'

app.factory('xml', ['$q', 'zspin', 'fs',
  function ($q, zspin, fs) {
    console.log('xml - init');
    var xml2js = require('xml2js');

    var parser = new xml2js.Parser({
      mergeAttrs: true,
      explicitCharkey: true,
      explicitArray: false
    });
    var service = {

      // Actual ini parsing
      parse: function(filepath) {
        var defer = $q.defer();
        fs.readFile(filepath, 'utf-8').then(function(data) {
          wrapErrCallback(defer, parser, parser.parseString, [data]);
        });
        return defer.promise.then(function(args) {
          return args[0];
        });
      }
    };
    console.log('xml - ready');
    return service;
  }
]);
