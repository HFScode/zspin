'use strict'

app.factory('xml', ['$q', 'zspin', 'fs',
  function ($q, zspin, fs) {
    var xml2js = require('xml2js');

    var parser = new xml2js.Parser({
      mergeAttrs: true,
      explicitCharkey: true,
      explicitArray: false
    });

    return {

      // Actual ini parsing
      parse: function(filepath) {
        var defer = $q.defer();
        filepath = fs.join(zspin.dataPath, filepath);
        fs.readFile(filepath, 'utf-8').then(function(data) {
          // var args = [fs].concat([].slice.call(arguments, 0));
          var func = parser.parseString.bind(parser.parseString, data);
          wrapCallback(defer, func);
        });
        return defer.promise;
      }
    };
  }
]);
