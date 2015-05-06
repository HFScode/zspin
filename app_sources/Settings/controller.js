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

    gpBinder.add({combo: '*', callback: function(input) {
      if (!focus) return;
      var binds = $scope.settings.binds;
      binds[focus.bind] = binds[focus.bind] || {};
      binds[focus.bind][focus.idx] = {source: 'gamepad', combo: input.combo};
    }});
    kbBinder.add({combo: '*', callback: function(input) {
      if (!focus) return;
      var binds = $scope.settings.binds;
      binds[focus.bind] = binds[focus.bind] || {};
      binds[focus.bind][focus.idx] = {source: 'keyboard', combo: input.combo};
    }});

    // Restore local settings to saved state
    $scope.reset = function() {
      angular.copy(settings.$obj, $scope.settings);
    }

    // Update global settings and persist to disk
    $scope.save = function() {
      angular.extend(settings.$obj, $scope.settings);
      settings.write();
    }
    $scope.settings = {};
    $scope.reset();

    $scope.clear = function(input) {
      $scope.settings.binds[input] = {};
    }

    $scope.setPress = function(event) {
      event.currentTarget.innerText = '<press a key>';
    }

    $scope.updatePath = function() {
      $scope.settings[this.name] = this.value;
      $scope.$apply();
    }

  }
]);
