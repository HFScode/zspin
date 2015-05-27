'use strict';

app.factory('zspin', ['fs', 'settings',
  function (fs, settings) {
    console.log('zspin - init');

    var gui = require('nw.gui');
    var flashTrust = require('nw-flash-trust');
    var spawn = require('child_process').spawn;

    var appName = 'zspin';
    var trustManager = flashTrust.initSync(appName);
    var guiWindow = gui.Window.get();

    var service = {};

    // Register global requires
    service.gui = gui;
    service.guiWindow = guiWindow;
    service.haveInternet = false;

    var root = process.cwd();
    var introFile = fs.join(root, 'swf', 'player_flv_js.swf');
    trustManager.add(introFile);
    console.log('flash trust', trustManager.list());

    service.reloadApp = function() {
      guiWindow.reload(3);
    };

    service.toggleFullscreen = function() {
      guiWindow.toggleFullscreen();
      guiWindow.focus();
    };

    service.focus = function() {
      guiWindow.focus();
    };

    service.quit = function() {
      gui.App.quit();
    };

    guiWindow.on('close', function() {
      console.log("Exiting...");
      // Smooth user experience
      this.hide();

      //running execOnExit app if present
      if (settings.$obj.execOnExit !== '') {
        var cmdLine = settings.$obj.execOnExit.split(' ');
        var params = cmdLine.slice(1);
        var binary = cmdLine[0];
        spawn(binary, params, {detached: true});
      }

      // Cleaning theme cache dir
      fs.rmrf(settings.hsPath(settings.$obj.cachePath, 'Theme'));

      // Closing app
      this.close(true);
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
