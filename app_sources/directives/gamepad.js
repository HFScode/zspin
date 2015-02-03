'use strict';

var KEY_REPEAT = 20;

app.factory('gamepads', ['$window', '$document', '$rootScope',
  function ($window, $document, $rootScope) {
    console.log('gamepads - init');

    var _lock = false;
    var _gpds = {};
    var _raf  = window.requestAnimationFrame.bind(window);


    var scopes = {};
    var binds  = {};
    var combos = {};

    // var service = {};
    // service.gamepads = _gpds;
    // service.tick = false;

    /*-----------------------------------------------------------------------*/

    function _registerGamepad(gpd) {
      // -> Register empty gamepad from the navigator gamepad
      var idx = gpd.index;
      function _pickAxeValue(i) { return i; }
      function _pickBtnValue(i) { return i.value; }
      _gpds[idx] = {
        timestamp : 0,
        id        : gpd.id,
        axes      : gpd.axes.map(_pickAxeValue),
        buttons   : gpd.buttons.map(_pickBtnValue),
      };
      console.log('gamepad %s> connected', idx, _gpds[idx]);
    };

    function _processCallback($id, combo, value, bind, time) {
      var thrld = bind.threshold || 0.5;
      var stale = time - (bind.repeat || 20);

      bind._flag = bind._flag || 0;
      if (bind._flag === 0)
        stale -= bind.penalty || 300;

      if (bind.action === 'keymove') {
        if (bind._timestamp < stale) {
          var callback = bind.callback.bind(null, combo, value);
          scopes[$id].$apply(callback);
          bind._timestamp = time;
        }
      } else if (value > thrld && bind.action === 'keydown') {
        if (!bind._timestamp || bind._timestamp <= stale) {
          var callback = bind.callback.bind(null, combo, value);
          scopes[$id].$apply(callback);
          bind._flag += 1;
          bind._timestamp = time;
        }
      } else if (value <= thrld && bind.action === 'keyup') {
        if (!bind._timestamp || bind._timestamp <= stale) {
          var callback = bind.callback.bind(combo, value);
          scopes[$id].$apply(callback);
          bind._flag += -1;
          bind._timestamp = time;
        }
      } else {
        bind._flag = -1;
      }
    }


    function _processCallbacks(combo, value) {
      var time = +(new Date());
      // var matches = []
      // var $ids = combos[combo] ? combos[combo].keys() : [];
      // $ids = $ids.concat(combo['*']);
      for (var $id in combos[combo]) {
        var list = binds[$id][combo];
        for (var idx in list)
          _processCallback($id, combo, value, list[idx], time);
      }
      for (var $id in combos['*']) {
        var list = binds[$id]['*'];
        for (var idx in list)
          _processCallback($id, combo, value, list[idx], time);
      }

    }


    function _processInputs(gpd) {
      var idx = gpd.index;
      // console.log('gamepad %s> updated', idx);
      // -> Compare button values with internals
      // buttons are object like  {pressed: bool, value: float}
      // we ditch the `pressed` prop because it's basicaly equal to !!value
      for (var i in gpd.buttons) {
        if (gpd.buttons[i].value !== _gpds[idx].buttons[i])
          _gpds[idx].buttons[i] = gpd.buttons[i].value;
        var combo = 'button'+i;
        var val = _gpds[idx].buttons[i];
        // console.log('gamepad #%s> %s:%s', idx, combo, gpd.buttons[i].value)
        _processCallbacks(combo, val);
      }
      // -> Compare axes values with internals
      // axes are values as floats
      for (var i in gpd.axes) {
        if (gpd.axes[i] !== _gpds[idx].axes[i])
          _gpds[idx].axes[i] = gpd.axes[i];
        var val = _gpds[idx].axes[i];
        var dir = (val >= 0) ? '+' : '-';
        var abs = (val >= 0) ? val : -val;
        var combo = 'axis'+i+dir;
        _processCallbacks(combo, abs);
      }
    };

    function  _unregisterGamepad(idx) {
      // -> Remove gamepdad from the list
      delete _gpds[idx];
      console.log('gamepad %s> disconnected', idx);
    };


    var poll = function() {
      // If the polling is locked, abort
      if (_lock) { return; }
      _lock = true;

      // Get gamepads, iterate over each
      var gpds = navigator.getGamepads();
      var time = +(new Date());
      for (var i = 0; i != gpds.length; ++i) {
        var gpd = gpds[i];

        // If gamepad has connected or disconnected
        if (gpd && gpd.connected && !_gpds[i]) {
          _registerGamepad(gpd)
        } else if (_gpds[i] && (!gpd || !gpd.connected)) {
          _unregisterGamepad(gpd ? gpd.index : i)
        }
        // Process status update, if any
        if (gpd && _gpds[i]) {
          var delay = time - _gpds[i].processed;
          if (_gpds[i].timestamp !== gpd.timestamp) {
            _processInputs(gpd);
            _gpds[i].timestamp = gpd.timestamp;
            _gpds[i].processed = time;
          } else if (delay > 20) {
            _processInputs(gpd);
            _gpds[i].processed = time;
          }
        }
      }

      // Release polling lock
      _lock = false;
      _raf(poll);
    };

    /*-----------------------------------------------------------------------*/

    poll();

    /*-----------------------------------------------------------------------*/

    function service ($scope) {
      // console.log($scope);
      var $id = $scope.$id;
      scopes[$id] = $scope;
      console.log('boite', $scope.$id, $id)
      $scope.$on('$destroy', function() {
        for (var combo in binds[$id])
          delete combos[combo][$id];
        delete binds[$id];
      });

      return {
        add: function (bind) {
          var combo = bind.combo;
          bind.action = bind.action || 'keydown';
          bind.threshold = bind.threshold || 0.5;
          // Register bind
          binds[$id] = binds[$id] || {};
          binds[$id][combo] = binds[$id][combo] || [];
          binds[$id][combo].push(bind);
          // Register combo in lookup table
          combos[combo] = combos[combo] || {};
          combos[combo][$id] = true;
          console.log(combos);
        },
        del: function (combo) {
          if (binds[$id] && combos[combo]) {
            // Remove from lookup
            delete combos[combo][$id];
            // De-register combo
            delete binds[$id][combo];
          }
        }
      };
    }


    console.log('gamepads - ready');
    return service;
  }
]);
