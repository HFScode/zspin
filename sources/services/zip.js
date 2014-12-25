'use strict';

app.factory('zip', ['$q',
  function ($q) {
    console.log('zip - init');
    var AdmZip = require('adm-zip');

    var service = function(filepath) {
      var zip = new AdmZip(filepath);
      return {
        getEntry: zip.getEntry.bind(zip),

        getEntries: zip.getEntries.bind(zip),

        readFile: function () {
          var defer = $q.defer();
          wrapCallback(defer, zip, zip.readFileAsync, arguments);
          return defer.promise.then(function (args) {
            return args[0];
          });
        }

      };
    };
    console.log('zip - ready');
    return service;
  }
]);
