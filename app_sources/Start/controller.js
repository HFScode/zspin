'use strict';

app.controller('StartCtrl', ['$scope', 'gamepads',
  function($scope, gamepads) {
    $scope.gamepads = gamepads.gamepads;
  }
]);
