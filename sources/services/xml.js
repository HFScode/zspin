'use strict'


app.factory('xml', ['$q', 'zspin', 'fs',
  function ($q, zspin, fs) {
    console.log('xml - init');
    var xml2js = require('xml2js');

    var parser = new xml2js.Parser({
      mergeAttrs: true,
      // explicitCharkey: true,
      // explicitChildren: true,
      explicitArray: false
    });
    var service = {

      // Actual ini parsing
      parse: function(filepath) {
        return fs.readFile(filepath, 'utf-8').then(function(data) {
          return service.parseString(data);
        });
      },
      parseString: function(filepath) {
        var defer = $q.defer();
        wrapErrCallback(defer, parser, parser.parseString, arguments);
        return defer.promise.then(function(args) {
          return args[0];
        });
      }
    };
    console.log('xml - ready');
    return service;
  }
]);
