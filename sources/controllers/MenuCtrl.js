'use strict';

app.controller('MenuCtrl', ['$scope', '$document', '$timeout', 'zspin', 'ini', 'xml',
  function($scope, $document, $timeout, zspin, ini, xml) {
    /************* This... is crack. ************/

    $scope.wheelItems = [];
    $scope.wheelPoints = [
      /* X, Y, Angle, Scale, z-index */
      [100, 100, 50, 1, 1],
      [150, 100, 20, 1, 2],
      [200, 100, 10, 1, 3],
      [350, 100, 0, 1.7, 10],
      [500, 100, -10, 1, 3],
      [550, 100, -20, 1, 2],
      [600, 100, -50, 1, 1]
    ];

    $scope.wheelOptions = {
      transitionTime: 100, // in ms
      selectPosition: 3, // index of item which serves as cursor
    };
    
    var updatePromise;
    $document.bind('keydown', function(e) {
      if (!$scope.wheelControl) return;
      if (e.which == 37) //left
        $scope.wheelControl.prev();
      if (e.which == 39) //right
        $scope.wheelControl.next();

      $timeout.cancel(updatePromise);
      updatePromise = $timeout(function() {
        var name = $scope.curItem.name;
        var root = 'Media/Main Menu/Themes/';
        var path = zspin.dataPath(root, name+'.zip');
        $scope.themePath = path;
      }, 200);       
      $scope.curItem = $scope.wheelControl.select();
      e.preventDefault();
    });   

    /********************************************/


    $scope.root = zspin.dataPath();
    $scope.openRoot = function() {
      zspin.gui.Shell.openItem($scope.root);
    };
    var settingsFile = zspin.dataPath('Settings/Main Menu.ini');
    ini.parse(settingsFile).then(function(data) {
      $scope.settings = data;
    });
    var databaseFile = zspin.dataPath('Databases/Main Menu/Main Menu.xml');
    xml.parse(databaseFile).then(function(data) {
      $scope.databases = data;
      $scope.wheelItems = data.menu.game.map(function(item) {
        var name = item.name;
        var root = 'Media/Main Menu/Images/Wheel';
        var path = zspin.dataPath(root, name+'.png');
        return {name: name, file: path};
      });
    });
  }
]);