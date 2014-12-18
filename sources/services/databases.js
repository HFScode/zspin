'use strict'

app.factory('databases', ['$q', 'zspin', 'fs',
  function ($q, zspin, fs) {
    var path = require('path');
    var mkdirp = require('mkdirp');
    var xml2js = require('xml2js');

    // init
    var dataPath = zspin.dataPath;
    var settingsPath = path.join(dataPath, 'Databases');
    mkdirp.sync(settingsPath);
    var parser = new xml2js.Parser({
      // mergeAttrs: true,
      // explicitCharkey: true,
      // explicitArray: false
    });

    return {
      // Set root paths
      root: settingsPath,

      // Actual ini parsing
      parse: function(name) {
        var d = $q.defer();
        var filename = name + '.xml';
        var filepath = path.join(settingsPath, name, filename);
        fs.readFile(filepath, 'utf-8').then(function(data) {
          parser.parseString(data, function(err, res) {
            if (err)
              d.reject(err);
            else 
              d.resolve(res);
          });
        });
        return d.promise;
      }
    };
  }
]);
