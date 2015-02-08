'use strict';

app.controller('DebugGamepadsCtrl', ['$scope', 'gamepads',
  function($scope, gamepads) {
    $scope.gamepads = gamepads.gamepads;


    $scope.log = {};
    $scope.update = function(input) {
      var gpdidx = input.gamepad;
      var log = ['gpd #', gpdidx, ' ', input.combo, ':', input.value];

      var slice = $scope.log[gpdidx] || [];
      slice = slice.slice(-5);
      slice.push(log.join(''));
      $scope.log[gpdidx] = slice;
      // if ($scope.log[gpdidx].length > 5)
      //   $scope.log[gpdidx].shift();
    };
  }
]);
