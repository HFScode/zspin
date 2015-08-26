'use strict';

app.factory('fileServer', ['$q', 'fs', 'settings', 'zip', 'xml',
  function($q, fs, settings, zip, xml) {
    console.log('fileServer - init');
    var service = {};
    var serverObj = null;

    var express = require('express');
    var remote = require('remote');

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

    // Route handling (because we need dynamic routing)
    function handler(req, res, next) {
      // removing first '/' and decoding url
      var q = decodeURIComponent(req.url.slice(1));

      if (q === "") {
        res.sendFile(fs.join(service.serveFolder, 'index.html'));

      } else if (q === "api/infos") {
        res.send({focus: remote.getCurrentWindow().isFocused()});

      } else if (service.serveFile[q] !== undefined) { // injected scripts
        res.sendFile(service.serveFile[q]);

      } else { // theme files, assets and etc
        res.sendFile(fs.join(service.serveFolder, q), {}, function(err) {
          if (err) {
            console.log(err);
            res.status(err.status).end();
          }
        });
      }
    }

    service.initServe = function() {
      service.serveFile = {
        'themeframe.js': fs.join(__dirname, 'js', 'themeframe.js'),
        'jquery.js': fs.join(__dirname, 'js', 'jquery.min.js'),
        'jquery.jplayer.js': fs.join(__dirname, 'js', 'jquery.jplayer.min.js'),
        'jquery.jplayer.swf': fs.join(__dirname, 'swf', 'jquery.jplayer.swf'),
      };
    };

    service.init = function() {
      // console.log('::: Init local server ');
      startServer(function() {
        // loading themeframe data
        fs.readFile(fs.join(__dirname, 'js', 'themeframe.js'), 'utf8').then(function(data) {
          global.fileServer.themeFrameData = data;
        });

        // all routes to handler function
        global.fileServer.get('/*', function(req, res, next) {
          handler(req, res, next);
        });
      }, function() {
        // console.log('::: Init local server failed');
      });
    };

    // path to serve for fallback files
    service.serveFolder = null;
    service.serveFile = null;
    service.initServe();

    service.stopServer = function() {
      serverObj.close();
    };

    console.log('fileServer - ready');
    return service;
  }
]);
