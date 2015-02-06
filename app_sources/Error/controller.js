'use strict';

app.controller('ErrorCtrl', ['$scope', 'gamepads',
  function($scope, gamepads, $routeParams) {
    $scope.gamepads = gamepads.gamepads;
    $scope.error_value = 'testing error value';
  }
]);
