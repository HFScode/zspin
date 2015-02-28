'use strict';

app.factory('DOMKeyboard', ['$rootScope', '$window',
  function ($rootScope, $window) {
    console.log('DOMKeyboard - init');

    var isOSX = ($window.navigator && $window.navigator.platform.indexOf('Mac') >=0);
    var PRINTABLE = new RegExp('^[^\x00-\x1F\x7f-\x9F]+$');

    function comboFromEvent(e) {
      var combo = [];
      if (e.keyIdentifier.match(/^U\+([0-9A-Z]+)$/)) {
        var codePoint = parseInt(RegExp.$1, 16);
        var keyIdentifier = String.fromCodePoint(codePoint);
        if (keyIdentifier == ' ')
          combo.push('Space');
        else if (keyIdentifier.match(PRINTABLE))
          combo.push(keyIdentifier);
        else if (codePoint == 127)
          combo.push('Delete');
      } else {
        if (e.keyIdentifier == 'Control')
          combo.push(isOSX?'Meta':'Ctrl');
        else if (e.keyIdentifier == 'Meta')
          combo.push(isOSX?'Ctrl':'Meta');
        else
          combo.push(e.keyIdentifier);
      }
      if (!combo.length) return;

      if (e.ctrlKey && e.keyIdentifier != 'Control')
        combo.unshift(isOSX?'Meta':'Ctrl');
        // combo.unshift(isOSX?'Ctrl':'Meta');
      if (e.shiftKey && e.keyIdentifier != 'Shift')
        combo.unshift('Shift');
      if (e.altKey && e.keyIdentifier != 'Alt')
        combo.unshift('Alt');
      if (e.metaKey && e.keyIdentifier != 'Meta')
        combo.unshift(isOSX?'Ctrl':'Meta');
      console.log(combo);
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
