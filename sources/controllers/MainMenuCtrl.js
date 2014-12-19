'use strict';


app.controller('MainMenuCtrl', ['$scope', '$location', 'zspin', 'settings', 'databases',
  function($scope, $location, zspin, settings, databases) {
    var gui = require('nw.gui');

    $scope.wheeloptions =  {
      ovalWidth: 400,
      ovalHeight: 50,
      offsetX: 100,
      offsetY: 325,
      angle: 0,
      activeItem: 0,
      duration: 350,
      className: 'item'
    }


    $scope.root = zspin.dataPath;
    $scope.openRoot = function() {
      gui.Shell.showItemInFolder(databases.root);
    };

    settings.parse('Main Menu').then(function(data) {
      $scope.settings = JSON.stringify(data, null, 2);
    });
    databases.parse('Main Menu').then(function(data) {
      $scope.databases = data;
    });
  }
]);