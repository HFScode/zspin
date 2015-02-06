'use strict';

app.controller('OptionsCtrl', ['$scope', 'gamepads',
  function($scope, gamepads) {
    $scope.gamepads = gamepads.gamepads;
  }
]);
