'use strict';

app.factory('DOMKeyboard', ['$rootScope', '$window',
  function ($rootScope, $window) {
    console.log('DOMKeyboard - init');

    var isOSX = ($window.navigator && $window.navigator.platform.indexOf('Mac') >=0);

    function printable(k) {
      return (k > 47 && k < 91 ? true : false);
    }

    function comboFromEvent(e) {
      var combo = [];

      if (e.code == 'Space') {
        combo.push('Space');
      } else if (e.key == 'Control') {
        combo.push(isOSX ? 'Meta' : 'Ctrl');
      } else if (e.key == 'Meta') {
        combo.push(isOSX ? 'Ctrl' : 'Meta');
      } else if (e.keyCode == 38) {
        combo.push('Up');
      } else if (e.keyCode == 40) {
        combo.push('Down');
      } else if (e.keyCode == 37) {
        combo.push('Left');
      } else if (e.keyCode == 39) {
        combo.push('Right');
      } else if (e.keyCode == 18) {
        combo.push('Alt');
      } else if (e.keyCode == 16) {
        combo.push('Shift');
      } else if (printable(e.keyCode)) {
        combo.push(String.fromCodePoint(e.keyCode));
      } else {
        combo.push(e.code);
      }

      if (!combo.length) return;

      if (e.ctrlKey && e.key != 'Control')
        combo.unshift(isOSX ? 'Meta' : 'Ctrl');
      if (e.shiftKey && e.key != 'Shift')
        combo.unshift('Shift');
      if (e.altKey && e.key != 'Alt')
        combo.unshift('Alt');
      if (e.metaKey && e.key != 'Meta')
        combo.unshift(isOSX ? 'Ctrl' : 'Meta');

      return combo.join('+').toLowerCase();
    }

    /*-----------------------------------------------------------------------*/

    var SCOPES = {};
    var BINDS  = {};
    var COMBOS = {};

    /***********************************
     * _trigger
     * @$id scope id
     * @bind bind metadas
     * @input keypress metadatas
     */
    function _trigger($id, bind, input) {
      var combo = input.combo;

      if (bind.action == input.action) {
        // Call callback in its scope
        var callback = bind.callback.bind(null, input);
        SCOPES[$id].$apply(callback);
      }
    }

    /***********************************
     * _processInput
     * @input.gamepad gamepad index
     * @input.combo key name
     * @input.action key event
     */
    function _processInput(input) {
      var $id, binds, i, bind;

      // For registered combo, _trigger() matching BINDS
      for ($id in COMBOS[input.combo]) {
        binds = BINDS[$id][input.combo];
        for (i in binds) {
          _trigger($id, binds[i], input);
        }
      }
      // For catch-all combo, _trigger() matching BINDS
      for ($id in COMBOS['*']) {
        binds = BINDS[$id]['*'];
        for (i in binds) {
          _trigger($id, binds[i], input);
        }
      }
    }

    /*-----------------------------------------------------------------------*/

    $window.addEventListener('keydown', function(e) {
      _processInput({combo: comboFromEvent(e), action: 'keydown'});
    });

    $window.addEventListener('keyup', function(e) {
      _processInput({combo: comboFromEvent(e), action: 'keyup'});
    });

    /*-----------------------------------------------------------------------*/

    function Binder ($scope) {
      var $id = this.$id = $scope.$id;
      SCOPES[$id] = $scope;
      $scope.$on('$destroy', function() {
        for (var combo in BINDS[$id])
          delete COMBOS[combo][$id];
        if (!Object.keys(COMBOS[combo]).length)
          delete COMBOS[combo];
        delete BINDS[$id];
        delete SCOPES[$id];
      });
    }

    Binder.prototype.add = function (bind) {
      var $id = this.$id;
      var combo = bind.combo = bind.combo.toLowerCase();
      bind.action    = bind.action    || 'keydown';
      bind.callback  = bind.callback  || function(){};
      // console.log('add', combo, bind);

      // Register bind
      BINDS[$id] = BINDS[$id] || {};
      BINDS[$id][combo] = BINDS[$id][combo] || [];
      BINDS[$id][combo].push(bind);

      // Register combo in lookup table
      COMBOS[combo] = COMBOS[combo] || {};
      COMBOS[combo][$id] = true;
      // console.log('added', BINDS,COMBOS);
    };

    Binder.prototype.del = function (combo) {
      // console.log('del', combo);
      var $id = this.$id;
      if (BINDS[$id] && COMBOS[combo]) {
        delete COMBOS[combo][$id];
        if (!Object.keys(COMBOS[combo]).length)
          delete COMBOS[combo];
        delete BINDS[$id][combo];
      }
      // console.log('deleted', BINDS,COMBOS);
    };


    // Default binder bound to fake scope -1
    // var binder = binder({$id: -1});
    var service = new Binder($rootScope);
    service.bindTo = function($scope) {
      return new Binder($scope);
    };

    console.log('DOMKeyboard - ready');
    return service;
  }
]);
