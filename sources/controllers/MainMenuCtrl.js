'use strict';


app.controller('MainMenuCtrl', ['$scope', '$location', 'settings',
  function($scope, $location, settings) {
    var gui = require('nw.gui');

    $scope.bite = "cul";
    $scope.root = settings.root;
    $scope.openRoot = function() {
      gui.Shell.showItemInFolder(settings.root);
    };
    
    settings.parse('Main Menu').then(function(data) {
      $scope.data = data;
    });
  }
]);