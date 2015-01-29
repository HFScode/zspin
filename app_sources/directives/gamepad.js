'use strict';

app.factory('gamepads', ['$window', '$document', '$rootScope',
  function ($window, $document, $rootScope) {
    console.log('gamepads - init');

    var _lock = false;
    var _gpds = {};
    var _raf  = window.requestAnimationFrame.bind(window);

    var service = {};
    service.gamepads = _gpds;
    service.tick = false;

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

    function _processInputs(gpd) {
      var idx = gpd.index;
      // -> Compare button values with internals
      // buttons are object like  {pressed: bool, value: float}
      // we ditch the pressed prop because it's basicaly !!value
      for (var i in gpd.buttons) {
        if (gpd.buttons[i].value !== _gpds[idx].buttons[i]) {
          console.log('gamepad %s> btn %s %s', idx, i, gpd.buttons[i].value)
          _gpds[idx].buttons[i] = gpd.buttons[i].value;
        }
      }
      // -> Compare axes values with internals
      // axes are values as floats
      for (var j in gpd.axes) {
        if (gpd.axes[j] !== _gpds[idx].axes[j]) {
          console.log('gamepad %s> axe %s %s', idx, j, gpd.axes[j]);
          _gpds[idx].axes[j] = gpd.axes[j];
        }
      }
    };

    function  _unregisterGamepad(idx) {
      // -> Remove gamepdad from the list
      delete _gpds[idx];
      console.log('gamepad %s> disconnected', idx);
    };


    service.poll = function() {
      // If the polling is locked, abort
      if (_lock) { return; }
      _lock = true;

      // Get gamepads, iterate over each
      var gpds = navigator.getGamepads();
      for (var i = 0; i != gpds.length; ++i) {
        var gpd = gpds[i];

        // If gamepad has connected or disconnected
        if (gpd && gpd.connected && !_gpds[i]) {
          _registerGamepad(gpd)
        } else if (_gpds[i] && (!gpd || !gpd.connected)) {
          _unregisterGamepad(gpd ? gpd.index : i)
        }
        // Process status update, if any
        if (gpd && _gpds[i] && gpd.timestamp !== _gpds[i].timestamp) {
          _processInputs(gpd);
          _gpds[i].timestamp = gpd.timestamp;
        }
      }

      // Release polling lock
      _lock = false;
      if (service.tick)
        _raf(service.poll);
    };

    /*-----------------------------------------------------------------------*/

    service.tick = true;
    service.poll();

    /*-----------------------------------------------------------------------*/


    console.log('gamepads - ready');
    return service;
  }
]);
