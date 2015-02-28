'use strict';

app.controller('DebugInputsCtrl', ['$scope', 'DOMKeyboard', 'NWKeyboard',
  function($scope, DOMKeyboard, NWKeyboard) {
    // $scope.gamepads = gamepads.gamepads;
    $scope.domLog = [];

    function domTick() {
      var timestamp = (new Date()).toISOString();
      var slice = $scope.domLog || [];
      slice.push(timestamp);
      slice = slice.slice(-5);
      $scope.domLog = slice;
    }
    $scope.domCombo = 'ctrl+f1';
    $scope.$watch('domCombo', function(val) {
      var bind = {};
      bind[val] = domTick;
      $scope.domBind = bind;
    });

    $scope.nwLog = [];
    function nwTick() {
      console.log('tick!');
      var timestamp = (new Date()).toISOString();
      var slice = $scope.nwLog || [];
      slice.push(timestamp);
      slice = slice.slice(-5);
      $scope.nwLog = slice;
    }
    $scope.nwCombo = 'ctrl+f2';
    $scope.$watch('nwCombo', function(val) {
      var bind = {};
      bind[val] = nwTick;
      $scope.nwBind = bind;
    });

    $scope.gpLog = [];
    function gpTick() {
      console.log('tick!');
      var timestamp = (new Date()).toISOString();
      var slice = $scope.gpLog || [];
      slice.push(timestamp);
      slice = slice.slice(-5);
      $scope.gpLog = slice;
    }
    $scope.gpCombo = 'button0';
    $scope.$watch('gpCombo', function(val) {
      var bind = {};
      bind[val] = gpTick;
      $scope.gpBind = bind;
      console.log('??', $scope.gpBind)
    });

  }
]);
