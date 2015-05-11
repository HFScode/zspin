'use strict';

app.factory('settings', [
  function () {
    console.log('settings - init');

    var fs = require('fs');
    var path = require('path');
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
      return path.join.apply(null, [binaryPath].concat(args));
    }

    // generates a path relative to the 'data' path of zspin
    // for example in osx: ~/Library/Application Support/zspin/Zspin
    // FIXME: use the hyperspin.exe path in settings for configuring this (if available)
    var dataPath = path.join(gui.App.dataPath, 'Zspin');

    service.dataPath = function() {
      var args = [].slice.call(arguments, 0);
      return path.join.apply(null, [dataPath].concat(args));
    };

    var settingsPath = service.dataPath('Settings.json');
    // Loads Settings.json next to binary if this file exists
    if (fs.existsSync(service.binaryPath('Settings.json'))) {
      settingsPath = service.binaryPath('Settings.json');
    }

    // Blocking settings "write"
    service.write = function() {
      var data = angular.copy(service.$obj);
      for (var idx in data.binds['home'])
        data.binds['home'][idx].global = true;
      data = JSON.stringify(data, null, 2);
      return fs.writeFileSync(settingsPath, data, 'utf8');
    };

    // Blocking settings "load"
    service.load = function() {
      var data = fs.readFileSync(settingsPath, 'utf8');
      try {
        var obj = JSON.parse(data);
        angular.extend(service.$obj, obj);
      } catch (e) {
        console.log('Settings Error:', e);
      }
    };

    // Blocking settings "init" (find or create)
    try {
      fs.accessSync(settingsPath, fs.F_OK);
      console.log('Settings file: ' + settingsPath);
    } catch (e) {
      console.log('No settings file ! Creating ' + settingsPath);
      service.write();
    }

    // Load curent values
    service.load();

    // Generates a path relative to the hyperspin.exe path (user-settable)
    service.hsPath = function() {
      var args = [].slice.call(arguments, 0);
      return path.join.apply(null, [path.dirname(service.$obj.hsPath)].concat(args));
    };

    console.log('settings - ready');
    return service;
  }
]);