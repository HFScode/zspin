'use strict';

app.factory('settings', [
  function () {
    console.log('settings - init');
    var service = {};

    var $fs = require('fs');
    var $path = require('path');
    var gui = require('remote').require('app');

    // Path for the app datas
    // for example in osx: ~/Library/Application Support/zspin/
    var dataPath = gui.getPath('userData');
    var settingsPath = $path.join(dataPath, 'Settings.json');

    // info: when adding a bind, be sure to also add it in settings/controller.js
    // in the sortedBinds array, otherwise the binding won't be available
    service.$obj = {
      binds: {
        'up':         {'0': {'source': 'keyboard', 'combo': 'up'}},
        'down':       {'0': {'source': 'keyboard', 'combo': 'down'}},
        'left':       {'0': {'source': 'keyboard', 'combo': 'left'}},
        'right':      {'0': {'source': 'keyboard', 'combo': 'right'}},
        'enter':      {'0': {'source': 'keyboard', 'combo': 'enter'}},
        'back':       {'0': {'source': 'keyboard', 'combo': 'shift'}},
        'home':       {'0': {'source': 'keyboard', 'combo': 'f10'}},
        'settings':   {'0': {'source': 'keyboard', 'combo': 'ctrl+s'}},
        'fullscreen': {'0': {'source': 'keyboard', 'combo': 'alt+enter'}},
        'devtools':   {'0': {'source': 'keyboard', 'combo': 'ctrl+d'}},
        'devmenu':    {'0': {'source': 'keyboard', 'combo': 'ctrl+shift+d'}},
      },
      hsPath: '',
      cachePath: 'zspin.cache',
      launcherPath: '',
      launcherParams: '{system} {rom}',
      execOnStart: '',
      execOnExit: '',
      firstRun: true,
    };

    // Generates a path relative to the binary executable
    service.binaryPath = function() {
      var args = [].slice.call(arguments, 0);
      return $path.join.apply(null, [binaryPath].concat(args));
    };

    // Generates a path relative to the os application data folder
    service.dataPath = function() {
      var args = [].slice.call(arguments, 0);
      return $path.join.apply(null, [dataPath].concat(args));
    };

    // Generates a path relative to the data folder path
    // (user-settable, folder that contains Media, Databases & etc)
    service.hsPath = function() {
      var hsPath = service.$obj.hsPath;
      var args = [].slice.call(arguments, 0);
      return $path.join.apply(null, service.$obj.hsPath.concat(args));
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

    // deletes the Settings.json file
    service.deleteSettingsFile = function() {
      $fs.unlinkSync(settingsPath);
    };

    // Settings setup
    //
    // This has to be blocking because we can't do anything without
    // the settings. Blocking coveniently stops angular from loading
    // before everything is ready.

    // Path of the app executable
    var binaryPath = $path.dirname(process.execPath); // FIXME test this in windows/linux
    if (process.platform == 'darwin') {
      binaryPath = binaryPath.replace(new RegExp('/[^/]+\.app/.*$'), '');
    }

    // Override settingsPath with binaryPath if it contains Settings.json
    try {
      var _path = $path.join(binaryPath, 'Settings.json');
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

    // Load current values
    service.load();

    console.log('settings - ready');
    return service;
  }
]);