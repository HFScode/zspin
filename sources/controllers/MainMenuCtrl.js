'use strict';

app.controller('MainMenuCtrl', ['$scope', '$document', 'zspin', 'settings', 'databases',
  function($scope, $document, zspin, settings, databases) {
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

    $document.bind('keydown', function(e) {
      if (e.which == 37) //left
        $scope.$apply(function() {$scope.wheelindex-- });
      if (e.which == 39) {//right
        $scope.$apply(function() {$scope.wheelindex++ });
      }
      e.preventDefault();
    });

    $scope.index = 0;
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