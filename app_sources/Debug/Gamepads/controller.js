'use strict';

app.controller('DebugGamepadsCtrl', ['$scope', 'gamepads',
  function($scope, gamepads) {
    $scope.gamepads = gamepads.gamepads;

    $scope.update = function() {
      // noop
    }
  }
]);
