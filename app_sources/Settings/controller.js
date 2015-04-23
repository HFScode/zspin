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
    var hsPath = $scope.hsPath = '';
    var launcherPath = $scope.launcherPath = '';
    var launcherParams = $scope.launcherParams = '';

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
      angular.copy(settings.$obj.hsPath, $scope.hsPath);
      angular.copy(settings.$obj.launcherPath, $scope.launcherPath);
      angular.copy(settings.$obj.launcherParams, $scope.launcherParams);
    }
    $scope.reset();
    $scope.save = function() {
      angular.copy($scope.binds, settings.$obj.binds);
      angular.copy($scope.hsPath, settings.$obj.hsPath);
      angular.copy($scope.launcherPath, settings.$obj.launcherPath);
      angular.copy($scope.launcherParams, settings.$obj.launcherParams);
      settings.write();
    }

    $scope.clear = function(input) {
      binds[input] = {};
    }

    $scope.setPress = function(event) {
      event.currentTarget.innerText = '<press a key>';
    }

    $scope.$watch('hsPath', function(newVal, oldVal) {
      console.log(newVal, oldVal);
    });
    // $scope.binds = ['home', 'up', 'down', 'left', 'right', 'enter', 'back'];
    // $scope.settings = {};

  }
]);
