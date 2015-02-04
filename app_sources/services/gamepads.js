'use strict';

app.factory('gamepads', ['$window', '$document', '$rootScope',
  function ($window, $document, $rootScope) {
    console.log('gamepads - init');

    var LOCK = false;
    var PADS = {};
    var _raf  = window.requestAnimationFrame.bind(window);

    var SCOPES = {};
    var BINDS  = {};
    var COMBOS = {};
    var GPDS   = {};
    // var GAMESPADS = GPDSPADS;
    // var service = {};
    // service.gamepads = PADS;
    // service.tick = false;

    /*-----------------------------------------------------------------------*/


    /***********************************
     * _trigger
     * @$id scope id
     * @bind bind metadas
     * @input button/axe metadatas
     * This will call the bind callback either if
     *  - button state has changed accordingly to binding action
     *  - button hasn't changed but it's time to repeat
     */
    function _trigger($id, bind, input) {
      // Create a unique key for input
      var combo = input.combo;
      // set state to 0 (up) or >1 (down)
      var state = (input.value > bind.threshold);
      // Compute last trigger age, default to 0
      var age = input.tick - (bind._tick||input.tick);
      // find or init bind states
      bind._states = bind._states || {};

      // Match input status to bind status
      if ((bind.action === 'keymove') ||
          (state && bind.action === 'keydown') ||
          (!state && bind.action === 'keyup')) {
        // If state change or if it's time to repeat
        if (state != bind._states[combo] || age >= bind.repeat) {
          // Call callback in its scope
          var callback = bind.callback.bind(null, input);
          SCOPES[$id].$apply(callback);
          // Update last trigger date
          // Add penalty if we're not alread repeating
          bind._tick = input.tick;
          if (state != bind._states[combo])
            bind._tick += bind.penalty;
        }
      }
      // Update input status
      bind._states[combo] = state;
    }

    /***********************************
     * _processInput
     * @input.gamepad gamepad index
     * @input.combo button/axe name
     * @input.value button/axe value
     * @input.tick tick timestamp
     * For the given input params, call matching callback
     */
    function _processInput(input) {
      var $id, binds, i, bind;

      // For registered combo, process matching BINDS
      for ($id in COMBOS[input.combo]) {
        binds = BINDS[$id][input.combo];
        for (i in binds) {
          if (binds[i].gamepad === '*' || binds[i].gamepad == input.gamepad)
            _trigger($id, binds[i], input);
        }
      }
      // For catch-all combo, process matchin BINDS
      for ($id in COMBOS['*']) {
        binds = BINDS[$id]['*'];
        for (i in binds) {
          if (binds[i].gamepad === '*' || binds[i].gamepad == input.gamepad)
            _trigger($id, binds[i], input);
        }
      }
    }

    /***********************************
     * _tickInputs
     * @gpd navigator gamepad object
     * This function is called to update internal values
     * and call _tickCallbacks() on each input
     */
    function _tickInputs(gpd) {
      // Grap input index
      var tick = +(new Date());
      var gpidx = gpd.index;

      // -> Update internal button values
      for (var i in gpd.buttons) {
        // Buttons are object like  {pressed: bool, value: float}
        // We ditch the `pressed` prop because it's basicaly equal to !!value
        PADS[gpidx].buttons[i] = gpd.buttons[i].value;
        _processInput({
          gamepad: gpidx,
          combo: 'button'+i,
          value: PADS[gpidx].buttons[i],
          tick: tick
        });
      }

      // -> Update internal axis values
      for (var j in gpd.axes) {
        // Update value
        PADS[gpidx].axes[j] = gpd.axes[j];
        // Each axe should range from -1 to 1, we keep the sign
        // for direction but normalise the value.
        // The sign table reads: down:+, right:+, up:-, left:-
        var value = PADS[gpidx].axes[j];
        var sign  = (value >= 0) ? '+' : '-';
        _processInput({
          gamepad: gpidx,
          combo: 'axis'+j+sign,
          value: Math.abs(value),
          tick: tick
        });
      }
    }

    /***********************************
     * _registerGamepad
     * @gpd navigator gamepad object
     * Add an empty pad objcet to the internal registry
     */
    function _registerGamepad(gpd) {
      PADS[gpd.index] = {id: gpd.id, index: gpd.index, axes: {}, buttons : {}};
      $rootScope.$emit('gamepad:connected', PADS[gpd.index]);
    }

    function  _unregisterGamepad(index) {
      delete PADS[index];
      $rootScope.$emit('gamepad:diconnected', index);
    }


    var poll = function() {
      // If the polling is locked, abort
      if (LOCK) { return; }
      LOCK = true;

      // Get gamepads, iterate over each
      var pads = navigator.getGamepads();
      var time = +(new Date());
      for (var i = 0; i != pads.length; ++i) {
        var gpd = pads[i];

        // If gamepad has connected or disconnected
        if (gpd && gpd.connected && !PADS[i]) {
          _registerGamepad(gpd);
        } else if (PADS[i] && (!gpd || !gpd.connected)) {
          _unregisterGamepad(gpd ? gpd.index : i);
        }
        // Process status update, if any
        if (gpd && PADS[i]) {
          if (PADS[i].timestamp !== gpd.timestamp) {
            _tickInputs(gpd);
            PADS[i].timestamp = gpd.timestamp;
            PADS[i].processed = time;
          } else if ((time - PADS[i].processed) > 20) {
            _tickInputs(gpd);
            PADS[i].processed = time;
          }
        }
      }

      // Release polling lock
      LOCK = false;
      _raf(poll);
    };

    /*-----------------------------------------------------------------------*/

    poll();

    /*-----------------------------------------------------------------------*/

    function Binder ($scope) {
      var $id = this.$id = $scope.$id;
      SCOPES[$id] = $scope;
      $scope.$on('$destroy', function() {
        for (var combo in BINDS[$id])
          delete COMBOS[combo][$id];
        delete BINDS[$id];
      });
    }

    Binder.prototype.add = function (bind) {
      var $id = this.$id;
      var combo = bind.combo;
      bind.action    = bind.action    || 'keydown';
      bind.threshold = bind.threshold || 0.5;
      bind.gamepad   = bind.gamepad   || '*';
      bind.repeat    = bind.repeat    || 70;
      bind.penalty   = bind.penalty   || 400;
      bind.state     = 0;

      // Register bind
      BINDS[$id] = BINDS[$id] || {};
      BINDS[$id][combo] = BINDS[$id][combo] || [];
      BINDS[$id][combo].push(bind);

      // Register combo in lookup table
      COMBOS[combo] = COMBOS[combo] || {};
      COMBOS[combo][$id] = true;
    };

    Binder.prototype.del = function (combo) {
      var $id = this.$id;
      if (BINDS[$id] && COMBOS[combo]) {
        delete COMBOS[combo][$id];
        delete BINDS[$id][combo];
      }
    };

    // Default binder bound to fake scope -1
    // var binder = binder({$id: -1});
    var service = new Binder($rootScope);
    service.bindTo = function($scope) {
      return new Binder($scope);
    };

    console.log('gamepads - ready');
    return service;
  }
]);
