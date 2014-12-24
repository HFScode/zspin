'use strict'

app.factory('zspin', ['fs',
  function (fs) {
    var gui = require('nw.gui');

    var zspin = {};

    // Register global requires
    zspin.gui = gui;

    // Setup Paths
    zspin.dataPath = fs.join(gui.App.dataPath, 'Zspin');
    zspin.mediasPath = fs.join(zspin.dataPath, 'Media');
    zspin.settingsPath = fs.join(zspin.dataPath, 'Settings');
    zspin.databasesPath = fs.join(zspin.dataPath, 'Databases');

    // Make Paths
    fs.mkdir(zspin.mediasPath);
    fs.mkdir(zspin.settingsPath);
    fs.mkdir(zspin.databasesPath);

    // Create a shortcut.
    var shortcut = new gui.Shortcut({key: 'Ctrl+4'});
    gui.App.registerGlobalHotKey(shortcut);
    shortcut.on('active', function() {
      gui.Window.get().show();
    });
    //gui.App.unregisterGlobalHotKey(shortcut);

    return zspin;
  }
]);
