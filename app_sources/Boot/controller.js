'use strict';

app.controller('BootCtrl', ['$scope', 'zspin', 'settings',
  function($scope, zspin, settings) {

    $scope.openData = function() {
      zspin.gui.Shell.openItem(settings.dataPath());
    };

    $scope.openHS = function() {
      zspin.gui.Shell.openItem(settings.hsPath());
    };

    $scope.openBinary = function() {
      zspin.gui.Shell.openItem(settings.binaryPath());
    };

    $scope.showDevTools = function() {
      zspin.gui.Window.get().showDevTools();
    };

  }
]);
