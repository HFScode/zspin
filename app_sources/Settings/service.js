'use strict';

app.factory('settings', ['zspin',
  function(zspin) {
    console.log('settings - init');

    var service = {};
    var fs = require('fs');

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

    var path = zspin.path('Settings.json');
    // Loads Settings.json next to binary if this file exists
    if (fs.existsSync(zspin.binaryPath('Settings.json'))) {
      path = zspin.binaryPath('Settings.json');
    }

    // Blocking settings "write"
    service.write = function() {
      var data = JSON.stringify(service.$obj, null, 2);
      return fs.writeFileSync(path, data, 'utf8');
    };

    // Blocking settings "load"
    service.load = function() {
      var data = fs.readFileSync(path, 'utf8');
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
    } catch (e) {
      service.write();
    }

    // Load curent values
    service.load();

    // Create global home shortcut
    var shortcut = new zspin.gui.Shortcut({key: service.$obj.binds['home'][0].combo});
    zspin.gui.App.registerGlobalHotKey(shortcut);
    shortcut.on('active', function() {
      zspin.gui.Window.get().show();
    });

    console.log('settings - ready');
    return service;
  }
]);