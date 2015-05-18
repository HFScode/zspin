'use strict';

app.factory('zspin', ['fs',
  function (fs) {
    console.log('zspin - init');

    var gui = require('nw.gui');
    var flashTrust = require('nw-flash-trust');

    var appName = 'zspin';
    var trustManager = flashTrust.initSync(appName);

    var service = {};

    // Register global requires
    service.gui = gui;

    var root = process.cwd();
    var introFile = fs.join(root, 'swf', 'player_flv_js.swf');
    trustManager.add(introFile);
    console.log('flash trust', trustManager.list());

    console.log('zspin - ready');
    return service;
  }
]);
