'use strict';

app.factory('zspin', ['fs', 'settings', '$http', 'dataServer',
  function (fs, settings, $http, dataServer) {
    console.log('zspin - init');

    const remote = require('electron').remote;
    const gui = remote.require('electron').app;

    const flashTrust = require('nw-flash-trust');
    const spawn = require('child_process').spawn;
    const pjson = remote.require('./package.json');

    var trustManager = flashTrust.initSync(
      pjson.name,
      settings.dataPath('Pepper Data', 'Shockwave Flash', 'WritableRoot')
    );

    var service = {};

    // Register service data
    service.gui = gui;
    service.guiWindow = remote.getCurrentWindow();
    service.haveInternet = false;
    service.menuHistory = {};
    service.appName = pjson.name;
    service.appLicense = pjson.license;
    service.options = remote.getGlobal('options');

    // starting local file & api server
    dataServer.init();

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

      // stop dataServer
      if (global.dataServer !== undefined) {
        dataServer.stopServer();
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
