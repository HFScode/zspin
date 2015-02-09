'use strict';

app.controller('BootCtrl', ['$scope', 'zspin',
  function($scope, zspin) {

    $scope.openRoot = function() {
      zspin.gui.Shell.openItem(zspin.path());
    };

  }
]);
