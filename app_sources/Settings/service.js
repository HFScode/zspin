'use strict';

app.factory('settings', [
  function () {
    console.log('settings - init');
    var service = {};

    var $fs = require('fs');
    var $path = require('path');
    var gui = require('nw.gui');

    // Path for the app datas
    // for example in osx: ~/Library/Application Support/zspin/Zspin
    var dataPath = $path.join(gui.App.dataPath, 'Zspin');
    var settingsPath = $path.join(dataPath, 'Settings.json')

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

    // Generates a path relative to the 'hsPath' path setting
    service.binaryPath = function() {
      var args = [].slice.call(arguments, 0);
      return $path.join.apply(null, [binaryPath].concat(args));
    };

    // Generates a path relative to the 'hsPath' path setting
    service.dataPath = function() {
      var args = [].slice.call(arguments, 0);
      return $path.join.apply(null, [dataPath].concat(args));
    };

    // Generates a path relative to the hyperspin.exe path (user-settable)
    service.hsPath = function() {
      var hsPath = service.$obj.hsPath;
      var args = [].slice.call(arguments, 0);
      return $path.join.apply(null, [$path.dirname(service.$obj.hsPath)].concat(args));
    };


    // Blocking settings "write"
    service.write = function() {
      var data = JSON.stringify(service.$obj, null, 2);
      return $fs.writeFileSync(settingsPath, data, 'utf8');
    };

    // Blocking settings "load"
    service.load = function() {
      var data = $fs.readFileSync(settingsPath, 'utf8');
      try {
        var obj = JSON.parse(data);
        angular.extend(service.$obj, obj);
      } catch (e) {
        console.log('Settings Error:', e);
      }
    };

    // Settings setup 
    //
    // This has to be blocking because we can't do anything without
    // the settings. Blocking coveniently stops angular from loading
    // before everything is ready.

    // Path of the app exetubale 
    var binaryPath = $path.dirname(process.execPath); // FIXME test this in windows/linux
    if (process.platform == 'darwin') {
      binaryPath = binaryPath.replace(new RegExp('/[^/]+\.app/.*$'), '');
    }

    // Override settingsPath with binaryPath if it contains Settings.json
    try {
      var _path = $path.join(binaryPath, 'Settings.json')
      $fs.accessSync(_path, $fs.F_OK | $fs.R_OR);
      settingsPath = _path;
    } catch (e) {}

    // Write defaults settings if there is no Settings.json to load
    try {
      $fs.accessSync(settingsPath, $fs.F_OK);
      console.log('Settings file: ' + settingsPath);
    } catch (e) {
      console.log('No settings file ! Creating ' + settingsPath);
      service.write();
    }

    // Load curent values
    service.load();

    console.log('settings - ready');
    return service;
  }
]);