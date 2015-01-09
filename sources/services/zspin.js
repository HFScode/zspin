'use strict'

app.factory('zspin', ['fs',
  function (fs) {
    console.log('zspin - init');
    var gui = require('nw.gui');

    var service = {};

    // Register global requires
    service.gui = gui;

    // Setup Paths
    var rootPath = gui.App.dataPath;
    service.rootPath = function() {
      var args = [].slice.call(arguments, 0);
      return fs.join.apply(fs, [rootPath].concat(args));
    };
    var dataPath = fs.join(gui.App.dataPath, 'Zspin');
    service.dataPath = function() {
      var args = [].slice.call(arguments, 0);
      return fs.join.apply(fs, [dataPath].concat(args));
    };

    service.mediasPath = fs.join(dataPath, 'Media');
    service.settingsPath = fs.join(dataPath, 'Settings');
    service.databasesPath = fs.join(dataPath, 'Databases');

    // Make Paths
    // fs.mkdir(service.mediasPath);
    // fs.mkdir(service.settingsPath);
    // fs.mkdir(service.databasesPath);

    // Create a shortcut.
    var shortcut = new gui.Shortcut({key: 'Ctrl+4'});
    gui.App.registerGlobalHotKey(shortcut);
    shortcut.on('active', function() {
      gui.Window.get().show();
    });
    //gui.App.unregisterGlobalHotKey(shortcut);
    console.log('service - ready');
    return service;
  }
]);
