'use strict';

app.factory('zip', ['zspin', 'fs',
  function (zspin, fs) {
    var AdmZip = require('adm-zip');

    return function(filepath) {
      filepath = fs.join(zspin.dataPath, filepath);
      console.log('pat2h', filepath);
      return new AdmZip(filepath);
    };
  }
]);
