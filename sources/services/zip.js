'use strict';

app.factory('zip', ['zspin', 'fs',
  function (zspin, fs) {
    var AdmZip = require('adm-zip');

    return function(filepath) {
      // filepath = fs.join(zspin.dataPath, filepath);
      var zip = AdmZip(filepath);
      return {
        getEntry: zip.getEntry.bind(zip),
        getEntries: zip.getEntries.bind(zip),

        readFile: function () {
          
        }

      };

      // console.log('pat2h', filepath);
      // return new AdmZip(filepath);
    };
  }
]);
