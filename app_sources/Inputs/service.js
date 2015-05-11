'use strict';

app.factory('inputs', ['$rootScope', 'NWKeyboard', 'DOMKeyboard', 'gamepads', 'zspin', 'settings',
  function ($rootScope, NWKeyboard, DOMKeyboard, gamepads, zspin, settings) {
    console.log('inputs - init');

    var $scope = $rootScope.$new();
    var service = {};

    var nwBinder = NWKeyboard.bindTo($scope);
    var kbBinder = DOMKeyboard.bindTo($scope);
    var gpBinder = gamepads.bindTo($scope);
    var BINDS = [];

    var nwWindow = zspin.gui.Window.get();
    var isWindowFocused = true;
    nwWindow.removeAllListeners('focus');
    nwWindow.on('focus', function() {
      isWindowFocused = true;
    });
    nwWindow.removeAllListeners('blur');
    nwWindow.on('blur', function() {
      isWindowFocused = false;
    });

    function _fireInput(input, bind) {
      if (!isWindowFocused && !bind.global)
        return;
      $rootScope.$broadcast('input:'+input, bind);
      console.log('!%s!', input, bind);
    }

    service.loadSettings = function() {
      var binds = settings.$obj.binds;

      // Remove any old binds
      for (var i in BINDS) {
        var bind = BINDS[i];
        if (bind.source == 'keyboard' && bind.global)
          nwBinder.del(BINDS[i].combo);
        else if (bind.source == 'keyboard')
          kbBinder.del(BINDS[i].combo);
        else if (bind.source == 'gamepad')
          gpBinder.del(BINDS[i].combo);
      }

      // Add new binds
      BINDS = [];
      for (var input in binds) {
        for (var idx in binds[input]) {
          var bind = binds[input][idx];
          var callback = _fireInput.bind(null, input, bind);
          var args = {combo: bind.combo, callback: callback};

          if (bind.source == 'keyboard' && bind.global)
            nwBinder.add(args);
          else if (bind.source == 'keyboard')
            kbBinder.add(args);
          else if (bind.source == 'gamepad')
            gpBinder.add(args);
          BINDS.push(bind);
        }
      }
    };

    service.loadSettings();

    console.log('inputs - ready');
    return service;
  }
]);
