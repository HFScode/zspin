'use strict';

app.factory('settings', ['zspin',
  function(zspin) {
    console.log('settings - init');

    var service = {};
    var fs = require('fs');
    var ini = require('ini');

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
    };

    var path = zspin.path('Settings.json');

    service.write = function() {
      var data = JSON.stringify($obj, null, 2);
      return fs.writeFileSync(path, data, 'utf8');
    };

    service.load = function() {
      var data = fs.readFileSync(path, 'utf8');
      try {
        var obj = JSON.parse(data);
        angular.copy(obj, $obj);
      } catch (e) {
        // fixme
        console.log('Settings Error:', e);
      }
    };

    service.load();

    console.log('settings - ready');
    return service;
  }
]);