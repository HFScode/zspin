'use strict';

app.controller('IntroCtrl', ['$scope', 'gamepads',
  function($scope, gamepads) {
    $scope.gamepads = gamepads.gamepads;
  }
]);
