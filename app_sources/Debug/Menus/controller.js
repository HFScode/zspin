'use strict';

app.controller('DebugMenusCtrl', ['$scope', 'gamepads',
  function($scope, gamepads) {
    $scope.gamepads = gamepads.gamepads;
  }
]);
