'use strict';

app.factory('zip', ['$q',
  function ($q) {
    console.log('zip - init');
    var fs = require('fs');
    var unzip = require('unzip');

    var service = {
      parse: function (src) {
        var defer = $q.defer();
        var istream = fs.createReadStream(src);
        var ostream = unzip.Parse();
        istream.on('error', function(err) {
          defer.reject(err);
         });
        ostream.on('error', function(err) {
          defer.reject(err);
        });
        ostream.on('entry', function(entry) {
          defer.notify(entry);
        });
        ostream.on('end', function() {
          defer.resolve();
        });
        istream.pipe(ostream);
        return defer.promise;
      },
      extract: function(src, dst) {
        var defer = $q.defer();
        var istream = fs.createReadStream(src);
        var ostream = unzip.Extract({path: dst});
        istream.on('error', function(err) {
          defer.reject(err);
        });
        ostream.on('error', function(err) {
          defer.reject(err);
        });
        ostream.on('close', function() {
          defer.resolve();
        });
        istream.pipe(ostream);
        return defer.promise;
      }
    };
    console.log('zip - ready');
    return service;
  }
]);
