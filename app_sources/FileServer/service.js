'use strict';

app.factory('fileServer', ['$q', 'fs', 'settings', 'zip', 'xml',
  function($q, fs, settings, zip, xml) {
    console.log('fileServer - init');
    var service = {};
    var serverObj = null;

    var express = require('express');

    service.port = 9666;
    service.url = 'http://localhost:'+service.port;

    // try to find a port then call callback
    function listen(cb) {
      serverObj = global.fileServer.listen(service.port).on('error', function(err) {
        if (err.errno === 'EADDRINUSE') {
          service.port += 1;
          service.url = 'http://localhost:'+service.port;
          listen(cb);
        } else {
          console.log(err);
        }
      }).on('listening', function() {
        // console.log('::: Listening on '+service.port);
        cb();
      });
    }

    // try to start server
    function startServer(cb_success, cb_failure) {
      if (cb_failure === undefined)
        cb_failure = cb_success;

      if (global.fileServer === undefined) {
        // console.log('::: Start server');
        global.fileServer = express();
        listen(cb_success);
      } else {
        cb_failure();
      }
    }

    // remove registered routes on current server instance
    service.cleanRoutes = function () {
      // console.log('::: Cleaning routes');
      delete global.fileServer._router.stack;
      global.fileServer._router.stack = [];
    }

    // serve a path, if no server, serve, else, clean routes before
    service.serveFolder = function (path) {
      // console.log('::: Serve folder '+path);
      startServer(function() {
        global.fileServer.use('/', express.static(path));
      }, function() {
        service.cleanRoutes();
        global.fileServer.use('/', express.static(path));
      });
    };

    // serve only one file on a specific route
    service.serveFile = function (file, path) {
      startServer(function () {
        // console.log('::: Adding file', file);
        global.fileServer.use('/'+encodeURI(file), express.static(path));
      });
    };

    service.stopServer = function() {
      serverObj.close();
    };

    console.log('fileServer - ready');
    return service;
  }
]);
