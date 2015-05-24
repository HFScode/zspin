'use strict';

app.factory('zspin', ['fs', 'settings',
  function (fs, settings) {
    console.log('zspin - init');

    var gui = require('nw.gui');
    var flashTrust = require('nw-flash-trust');

    var appName = 'zspin';
    var trustManager = flashTrust.initSync(appName);
    var guiWindow = gui.Window.get();

    var service = {};

    // Register global requires
    service.gui = gui;
    service.guiWindow = guiWindow;

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
      this.hide(); // Smooth user experience
      console.log("Exiting...");
      fs.rmrf(settings.hsPath(settings.$obj.cachePath, 'Theme'));
      this.close(true);
    });

    console.log('zspin - ready');
    return service;
  }
]);
