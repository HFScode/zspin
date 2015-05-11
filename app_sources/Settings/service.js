'use strict';

app.factory('settings', ['fs',
  function (fs) {
    console.log('settings - init');

    var fsRaw = require('fs')
    var gui = require('nw.gui');
    var service = {};

    service.$obj = {
      binds: {
        'home': {},
        'up': {},
        'down': {},
        'left': {},
        'right': {},
        'enter': {},
        'back': {}
      },
      hsPath: '',
      launcherPath: '',
      launcherParams: ''
    };

    // Getting path of executable
    var binaryPath = process.cwd(); // FIXME test this in windows/linux
    if (process.platform == 'darwin') {
        // avoids to get the binary app.nw when released in a .app mac package
        binaryPath = binaryPath.replace(/\/[^\/]+\.app\/.*$/g, '');
    }

    // generates a path relative to the zspin binary path
    service.binaryPath = function() {
      var args = [].slice.call(arguments, 0);
      return fs.join.apply(fs, [binaryPath].concat(args));
    }

    // generates a path relative to the 'data' path of zspin
    // for example in osx: ~/Library/Application Support/zspin/Zspin
    // FIXME: use the hyperspin.exe path in settings for configuring this (if available)
    var dataPath = fs.join(gui.App.dataPath, 'Zspin');

    service.dataPath = function() {
      var args = [].slice.call(arguments, 0);
      return fs.join.apply(fs, [dataPath].concat(args));
    };

    var path = service.dataPath('Settings.json');
    // Loads Settings.json next to binary if this file exists
    if (fsRaw.existsSync(service.binaryPath('Settings.json'))) {
      path = service.binaryPath('Settings.json');
    }

    // Blocking settings "write"
    service.write = function() {
      var data = angular.copy(service.$obj);
      for (var idx in data.binds['home'])
        data.binds['home'][idx].global = true;
      data = JSON.stringify(data, null, 2);
      return fsRaw.writeFileSync(path, data, 'utf8');
    };

    // Blocking settings "load"
    service.load = function() {
      var data = fsRaw.readFileSync(path, 'utf8');
      try {
        var obj = JSON.parse(data);
        angular.extend(service.$obj, obj);
      } catch (e) {
        console.log('Settings Error:', e);
      }
    };

    // Blocking settings "init" (find or create)
    try {
      fs.accessSync(path, fs.F_OK);
      console.log('Settings file: ' + path);
    } catch (e) {
      console.log('No settings file ! Creating ' + path);
      service.write();
    }

    // Load curent values
    service.load();

    console.log('settings - ready');
    return service;
  }
]);