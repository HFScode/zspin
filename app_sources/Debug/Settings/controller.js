'use strict';

app.controller('DebugSettingsCtrl', ['$scope', 'settings',
  function($scope, settings) {
    $scope.settings = settings;
  }
]);
