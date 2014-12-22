'use strict'

app.factory('zspin', ['fs',
  function (fs) {
    var gui = require('nw.gui');

    var zspin = {};

    // Register global requires
    zspin.gui = gui;

    // Setup Paths
    zspin.dataPath = fs.join(gui.App.dataPath, 'Zspin');
    zspin.mediasPath = fs.join(zspin.dataPath, 'Medias');
    zspin.settingsPath = fs.join(zspin.dataPath, 'Settings');
    zspin.databasesPath = fs.join(zspin.dataPath, 'Databases');

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
