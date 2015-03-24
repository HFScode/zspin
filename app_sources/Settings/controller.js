'use strict';

app.controller('SettingsCtrl', ['$scope', 'DOMKeyboard', 'gamepads', 'settings', 'inputs',
  function($scope, DOMKeyboard, gamepads, settings, inputs) {

    var gpBinder = gamepads.bindTo($scope);
    var kbBinder = DOMKeyboard.bindTo($scope);

    var focus = undefined;
    $scope.focus = function(bind, idx) {
      focus = {bind: bind, idx: idx};
    };
    $scope.blur = function() {
      focus = undefined;
    };

    var binds = $scope.binds = {'home': {}, 'up': {}, 'down': {}, 'left': {}, 'right': {}, 'enter': {}, 'back': {}};
    gpBinder.add({combo: '*', callback: function(input) {
      if (!focus) return;
      binds[focus.bind] = binds[focus.bind] || {};
      binds[focus.bind][focus.idx] = {source: 'gamepad', combo: input.combo};
    }});
    kbBinder.add({combo: '*', callback: function(input) {
      if (!focus) return;
      binds[focus.bind] = binds[focus.bind] || {};
      binds[focus.bind][focus.idx] = {source: 'keyboard', combo: input.combo};
    }});

    $scope.reset = function() {
      angular.copy(settings.$obj.binds, $scope.binds);
    }
    $scope.reset();
    $scope.save = function() {
      angular.copy($scope.binds, settings.$obj.binds);
      settings.write();
    }

    // $scope.binds = ['home', 'up', 'down', 'left', 'right', 'enter', 'back'];
    // $scope.settings = {};

  }
]);
