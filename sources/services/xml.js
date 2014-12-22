'use strict'

app.factory('xml', ['$q', 'zspin', 'fs',
  function ($q, zspin, fs) {
    var xml2js = require('xml2js');

    // init
    // var dataPath = zspin.dataPath;
    // var settingsPath = path.join(dataPath, 'Databases');
    // fs.mkdirp.sync(settingsPath);

    var parser = new xml2js.Parser({
      // mergeAttrs: true,
      // explicitCharkey: true,
      // explicitArray: false
    });

    return {

      // Actual ini parsing
      parse: function(filepath) {
        var d = $q.defer();
        filepath = fs.join(zspin.dataPath, filepath);
        fs.readFile(filepath, 'utf-8').then(function(data) {
          wrapCallback(d, parser.parseString, parser, [data]);
        });
        return d.promise;
      }
    };
  }
]);
