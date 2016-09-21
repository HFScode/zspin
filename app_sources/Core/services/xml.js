'use strict'

app.factory('xml', ['$q', 'fs', 'qbind',
  function ($q, fs, qbind) {
    console.log('xml - init');
    const xml2js = require('xml2js');

    var parser = new xml2js.Parser({
      mergeAttrs: true,
      // explicitCharkey: true,
      // explicitChildren: true,
      explicitArray: false
    });

    //  -  Services for xml-file parsing  -
    var service = {

      parse: function(filepath) {
        return fs.readFile(filepath, 'utf8').then(function(data) {
          return service.parseString(data);
        });
      },

      parseString: function() {
        return qbind.apply(parser, parser.parseString, arguments)
          .then(function(args) { return args[0]; });
      }

    };
    console.log('xml - ready');
    return service;
  }
]);
