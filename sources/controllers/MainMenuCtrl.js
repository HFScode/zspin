'use strict';


app.controller('MainMenuCtrl', ['$scope', '$location', 'zspin', 'settings', 'databases',
  function($scope, $location, zspin, settings, databases) {
    var gui = require('nw.gui');

    $scope.root = zspin.dataPath;
    $scope.openRoot = function() {
      gui.Shell.showItemInFolder(zspin.dataPath);
    };

    settings.parse('Main Menu').then(function(data) {
      $scope.settings = JSON.stringify(data, null, 2);
    });
   
    databases.parse('Main Menu').then(function(data) {
      $scope.databases = JSON.stringify(data, null, 2);
    });
  }
]);