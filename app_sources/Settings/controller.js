'use strict';

app.controller('SettingsCtrl', ['$scope', 'DOMKeyboard', 'gamepads' ,
  function($scope, DOMKeyboard, gamepads) {

    var gpBinder = gamepads.bindTo($scope);
    var kbBinder = DOMKeyboard.bindTo($scope);

    $scope.times = function(num, val) {
      return Array.apply(null, new Array(num))
        .map(function() { return val||0; });
    };

    $scope.focus = undefined;
    $scope.setFocus = function(bind, idx) {
      console.log('focus', bind, idx);
      $scope.focus = {bind: bind, idx: idx};
    };
    $scope.blur = function() {
      console.log('blur');
      $scope.focus = undefined;
    };

    function set(input) {
      var focus = $scope.focus;
      console.log(input, focus);
      if (!$scope.focus) return;

      settings[focus.bind] = settings[focus.bind] || [];
      settings[focus.bind][focus.idx] = input.combo;
    }
    gpBinder.add({combo: '*', callback: set});
    kbBinder.add({combo: '*', callback: set});

    $scope.binds = ['up', 'down', 'left', 'right', 'enter', 'back'];
    var settings = $scope.settings = {};

  }
]);
