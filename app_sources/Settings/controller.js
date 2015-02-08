'use strict';

app.controller('SettingsCtrl', ['$scope', 'gamepads',
  function($scope, gamepads) {
    $scope.gamepads = gamepads.gamepads;
  }
]);
