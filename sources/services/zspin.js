'use strict'

app.factory('zspin', [ 
  function () {
    var gui = require('nw.gui');
    var path = require('path');

    return {
      // Set root paths
      dataPath: path.join(gui.App.dataPath, 'Zspin')
    };
  }
]);
