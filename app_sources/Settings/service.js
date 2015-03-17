'use strict';

app.factory('settings', ['fs', 'zspin',
  function(fs, zspin) {
    console.log('settings - init');

    var service = {};

    var $obj = service.$obj = {
      binds: {
        'home': {},
        'up': {},
        'down': {},
        'left': {},
        'right': {},
        'enter': {},
        'back': {}
      }
    }

    var path = zspin.path('Settings.json');

    service.write = function() {
      var data = JSON.stringify($obj, null, 2);
      return fs.writeFile(path, data);
    }

    service.load = function() {
      try {
        var data = require(path);
        angular.copy(data, $obj);
      } catch (e) {};
    }

    service.load();

    console.log('settings - ready');
    return service;
  }
]);