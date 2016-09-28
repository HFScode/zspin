'use strict';

app.factory('dataServer', ['$q', 'fs', 'settings', 'zip', 'xml',
  function($q, fs, settings, zip, xml) {
    console.log('dataServer - init');
    var service = {};
    var serverObj = null;

    const express = require('express');
    const remote = require('electron').remote;
    const $fs = require('fs');

    service.port = 9666;
    service.url = 'http://localhost:'+service.port;

    // api - holds current element infos from xml
    service.infos = {};

    // try to find a port then call callback
    function listen(cb) {
      serverObj = global.dataServer.listen(service.port).on('error', function(err) {
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

      if (global.dataServer === undefined) {
        // console.log('::: Start server');
        global.dataServer = express();
        listen(cb_success);
      } else {
        cb_failure();
      }
    }

    // Route handling (because we need dynamic routing)
    function handler(req, res, next) {
      // removing first '/' and decoding url
      var q = decodeURIComponent(req.url.slice(1));
      var tmp;

      if (q === "") {
        res.sendFile(fs.join(service.serveFolder, 'index.html'));

      } else if (q === "api/zspin") {
        res.send({focused: remote.getCurrentWindow().isFocused()});

      } else if (q === "api/infos") {
        res.send(service.infos);

      } else if (service.serveFile[q] !== undefined) { // injected scripts
        res.sendFile(service.serveFile[q]);

      } else { // theme files, assets and etc

        // try serveFolder path
        try {
          tmp = fs.join(service.serveFolder, q).replace(/\.\.\//g, '');
          $fs.accessSync(tmp, $fs.F_OK);
          res.sendFile(tmp, {}, function(err) {
            if (err) {console.log(err); res.status(err.status).end();}
          });
          return;
        } catch (e) {}

        // try Media folder path
        try {
          tmp = settings.hsPath('Media', q).replace(/\.\.\//g, '');
          $fs.accessSync(tmp, $fs.F_OK);
          res.sendFile(tmp, {}, function(err) {
            if (err) {console.log(err); res.status(err.status).end();}
          });
          return;
        } catch (e) {}
      }
    }

    service.initServe = function() {
      service.serveFile = {
        'themeframe.js': fs.join(__dirname, 'js', 'themeframe.js'),
        'jquery.js': fs.join(__dirname, 'js', 'jquery.min.js'),
        'jquery.jplayer.js': fs.join(__dirname, 'js', 'jquery.jplayer.min.js'),
        'swf2js.js': fs.join(__dirname, 'js', 'swf2js.js'),
        'TweenMax.min.js': fs.join(__dirname, 'js', 'TweenMax.min.js'),
        'jquery.jplayer.swf': fs.join(__dirname, 'swf', 'jquery.jplayer.swf'),
      };
    };

    service.init = function() {
      // console.log('::: Init local server ');
      startServer(function() {
        // loading themeframe data
        fs.readFile(fs.join(__dirname, 'js', 'themeframe.js'), 'utf8').then(function(data) {
          global.dataServer.themeFrameData = data;
        });

        // all routes to handler function
        global.dataServer.get('/*', function(req, res, next) {
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

    console.log('dataServer - ready');
    return service;
  }
]);
