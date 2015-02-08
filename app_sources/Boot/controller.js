'use strict';

app.controller('BootCtrl', ['$scope', 'zspin',
  function($scope, zspin) {

    $scope.openRoot = function() {
      console.log(zspin.path())
      zspin.gui.Shell.openItem(zspin.path());
    };

  }
]);
