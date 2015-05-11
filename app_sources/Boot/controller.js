'use strict';

app.controller('BootCtrl', ['$scope', 'zspin', 'settings',
  function($scope, zspin) {

    $scope.openRoot = function() {
      zspin.gui.Shell.openItem(settings.dataPath());
    };

  }
]);
