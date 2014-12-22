'use strict';

app.controller('MainMenuCtrl', ['$scope', '$document', 'zspin', 'ini', 'xml',
  function($scope, $document, zspin, ini, xml) {
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
      gui.Shell.showItemInFolder(zspin.settingsPath);
    };

    ini.parse('Settings/Main Menu.ini').then(function(data) {
      $scope.settings = JSON.stringify(data, null, 2);
    });
    xml.parse('Databases/Main Menu/Main Menu.xml').then(function(data) {
      $scope.databases = data;
    });
  }
]);