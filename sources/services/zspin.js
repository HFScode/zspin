'use strict'

app.factory('zspin', [ 
  function () {
    var gui = require('nw.gui');
    var path = require('path');

    // Create a shortcut.
    var shortcut = new gui.Shortcut({key: 'Ctrl+4'});
    gui.App.registerGlobalHotKey(shortcut);
    shortcut.on('active', function() {
      gui.Window.get().show();
    });
    //gui.App.unregisterGlobalHotKey(shortcut);

    return {
      // Set root paths
      dataPath: path.join(gui.App.dataPath, 'Zspin')
    };
  }
]);
