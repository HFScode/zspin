'use strict';

app.factory('inputs', ['$rootScope', 'NWKeyboard', 'gamepads', 'settings',
  function ($rootScope, keyboard, gamepads, settings) {

    var SCOPES = {};
    var BINDS  = {};
    var COMBOS = {};

    function Binder ($scope) {
      var $id = this.$id = $scope.$id;

      SCOPES[$id] = $scope;
    }

    Binder.prototype.add = function (bind) {
      var $id = this.$id;
      var combo = bind.combo;
      bind.action    = bind.action    || 'keydown';
      bind.callback  = bind.callback  || function(){};

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
