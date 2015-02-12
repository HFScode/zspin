'use strict'

app.factory('zspin', ['fs',
  function (fs) {
    console.log('zspin - init');

    var gui = require('nw.gui');
    var flashTrust = require('nw-flash-trust');

    try {
      var appName = 'zspin';
      var trustManager = flashTrust.initSync(appName);
    } catch(err) {
      if (err.message === 'Flash Player config folder not found.') {
      }
    }

    var service = {};

    // Register global requires
    service.gui = gui;

    // Setup Paths
    // var rootPath = gui.App.dataPath;
    // service.rootPath = function() {
    //   var args = [].slice.call(arguments, 0);
    //   return fs.join.apply(fs, [rootPath].concat(args));
    // };

    var path = fs.join(gui.App.dataPath, 'Zspin');
    service.path = function() {
      var args = [].slice.call(arguments, 0);
      return fs.join.apply(fs, [path].concat(args));
    };

    var root = process.cwd();
    var introFile = fs.join(root, 'swf', 'player_flv_js.swf');
    trustManager.add(introFile);
    console.log('flash trust', trustManager.list());


    // fs.mkdir(service.mediasPath);

    // // Setting services's paths
    // service.mediasPath = fs.join(dataPath, 'Media');
    // service.settingsPath = fs.join(dataPath, 'Settings');
    // service.databasesPath = fs.join(dataPath, 'Databases');

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
    console.log('zspin - ready');
    return service;
  }
]);
