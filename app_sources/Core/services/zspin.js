'use strict';

app.factory('zspin', ['fs', 'settings', '$http', 'fileServer',
  function (fs, settings, $http, fileServer) {
    console.log('zspin - init');

    var remote = require('remote');
    var gui = remote.require('app');

    var flashTrust = require('nw-flash-trust');
    var spawn = require('child_process').spawn;

    var appName = remote.require('./package.json').name;
    var trustManager = flashTrust.initSync(
      appName,
      settings.dataPath('Pepper Data', 'Shockwave Flash', 'WritableRoot')
    );

    var service = {};

    // Register service data
    service.gui = gui;
    service.guiWindow = remote.getCurrentWindow();
    service.haveInternet = false;
    service.menuHistory = {};
    service.appName = appName;

    // starting local file & api server
    fileServer.init();

    trustManager.empty();
    trustManager.add(fs.join(__dirname, 'swf', 'jquery.jplayer.swf'));

    service.reloadApp = function() {
      service.guiWindow.reload();
    };

    service.toggleFullscreen = function() {
      // worked once
      // does weird stuff when replaced with "setKiosk"
      if (service.guiWindow.isFullScreen()) {
        service.guiWindow.setFullScreen(false);
      } else {
        service.guiWindow.setFullScreen(true);
      }
    };

    service.focus = function() {
      service.guiWindow.focus();
    };

    service.quit = function() {
      service.guiWindow.close();
    };

    // check if we have internet
    $http.get('http://stats.vik.io/ping?'+Math.random(), {timeout: 1000})
      .success(function () {service.haveInternet = true;});

    // /!\ Mem leak if reload
    // https://github.com/atom/electron/blob/master/docs/api/browser-window.md#event-close
    service.guiWindow.on('close', function() {
      console.log("Exiting...");
      // Smooth user experience
      // service.guiWindow.hide();

      // stop fileServer
      if (global.fileServer !== undefined) {
        fileServer.stopServer();
      }

      // running execOnExit app if present
      if (settings.$obj.execOnExit !== '') {
        var cmdLine = settings.$obj.execOnExit.split(' ');
        var params = cmdLine.slice(1);
        var binary = cmdLine[0];
        spawn(binary, params, {detached: true});
      }

      // Cleaning theme cache dir
      fs.rmrf(settings.hsPath(settings.$obj.cachePath, 'Theme'));

      return false;
    });

    // Loads any startup command
    if (settings.$obj.execOnStart !== '') {
      var cmdLine = settings.$obj.execOnStart.split(' ');
      var params = cmdLine.slice(1);
      var binary = cmdLine[0];
      spawn(binary, params, {detached: true});
    }

    console.log('zspin - ready');
    return service;
  }
]);
