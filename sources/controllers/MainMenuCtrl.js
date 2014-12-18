'use strict';


app.controller('MainMenuCtrl', ['$scope', '$location', 'settings', 'databases',
  function($scope, $location, settings, databases) {
    var gui = require('nw.gui');

    $scope.root = databases.root;
    $scope.openRoot = function() {
      gui.Shell.showItemInFolder(databases.root);
    };

    settings.parse('Main Menu').then(function(data) {
      $scope.settings = JSON.stringify(data, null, 2);
    });
   
    databases.parse('Main Menu').then(function(data) {
      $scope.databases = JSON.stringify(data, null, 2);
    });
  }
]);