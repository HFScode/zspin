'use strict';

app.factory('NWKeyboard', ['$rootScope', '$window',
  function ($rootScope, $window) {
    console.log('NWKeyboard - init');
    var gui = require('nw.gui');

    var SCOPES = {};
    var BINDS  = {};
    var COMBOS = {};
    var HOTKEYS =  {};

    var HISTORY = {};
    function write_history() {
      window.localStorage.nwkeyboard = JSON.stringify(HISTORY);
    }
    function read_history() {
      HISTORY = JSON.parse(window.localStorage.nwkeyboard || '{}');
    }

    /***********************************
     * _processInput
     * @input.gamepad gamepad index
     * @input.key key name
     * @input.action key event
     */
    function _processInput(input) {
      var $id, binds, i, bind, callback;

      // For registered combo, _trigger() matching BINDS
      for ($id in COMBOS[input.combo]) {
        binds = BINDS[$id][input.combo];
        for (i in binds) {
          callback = binds[i].callback.bind(null, input);
          SCOPES[$id].$apply(callback);
        }
      }
    }

    function Binder ($scope) {
      var $id = this.$id = $scope.$id;
      SCOPES[$id] = $scope;
      $scope.$on('$destroy', this.destroy.bind(this));
    }

    Binder.prototype.destroy = function () {
      var $id = this.$id;

      for (var combo in BINDS[$id])
        this.del(combo);
      delete SCOPES[$id];
    };

    Binder.prototype.add = function (bind) {
      var $id = this.$id;

      var combo = bind.combo;
      console.log('add', combo);

      // Register bind
      BINDS[$id] = BINDS[$id] || {};
      BINDS[$id][combo] = BINDS[$id][combo] || [];
      BINDS[$id][combo].push(bind);

      // Register combo in lookup table
      COMBOS[combo] = COMBOS[combo] || {};
      COMBOS[combo][$id] = true;

      if (HOTKEYS[combo]) return;
      // Actually register hotkey of needed
      var hotkey = new gui.Shortcut({
        key: combo,
        active: _processInput.bind(null, {combo: bind.combo}),
        failed: this.del.bind(this, bind.combo),
      });
      gui.App.registerGlobalHotKey(hotkey);
      HOTKEYS[combo] = hotkey;

      // Add in history
      HISTORY[combo] = true;
      write_history();

      console.log('added', BINDS, COMBOS, HOTKEYS);
    };

    Binder.prototype.del = function (combo) {
      var $id = this.$id;
      console.log('del', combo);

      // Remove from lookup table & cleanup if needed
      if (COMBOS[combo] && COMBOS[combo][$id]) {
        delete COMBOS[combo][$id];
        if (!Object.keys(COMBOS[combo]).length)
          delete COMBOS[combo];
      }
      // Unregister bind if needed & cleanup if needed
      if (BINDS[$id] && BINDS[$id][combo]) {
        delete BINDS[$id][combo];
        if (!Object.keys(BINDS[$id]).length)
          delete BINDS[$id];
      }
      // Delete hotkey and history if needed
      if (HOTKEYS[combo] && !COMBOS[combo]) {
        gui.App.unregisterGlobalHotKey(HOTKEYS[combo]);
        delete HOTKEYS[combo];
        delete HISTORY[combo];
        write_history();
      }
      console.log('deleted', BINDS, COMBOS, HOTKEYS);

    };

    // Necessary cleanup
    read_history();
    for (var combo in HISTORY) {
      var hotkey = new gui.Shortcut({key: combo});
      gui.App.unregisterGlobalHotKey(hotkey);
      delete HISTORY[combo];
    }
    write_history();
    console.log('cleanup', HISTORY);

    var service = new Binder($rootScope);
    service.bindTo = function($scope) {
      return new Binder($scope);
    };


    console.log('NWKeyboard - ready');
    return service;
  }
]);
