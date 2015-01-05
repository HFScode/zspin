'use strict';

app.controller('MenuCtrl', ['$scope', '$document', '$timeout', 'fs', 'zspin', 'ini', 'xml',
  function($scope, $document, $timeout, fs, zspin, ini, xml) {
    $scope.menu = 'Main Menu';

    /************* This... is crack. ************/

    $scope.wheelItems = [];
    $scope.wheelOptions = {
      transitionTime: 100, // in ms
      selectPosition: 3,   // index of item which serves as cursor
      points: [            
        // X, Y, Angle, Scale, z-index
        [100, 100,  50,   1,   1],
        [150, 100,  20,   1,   2],
        [200, 100,  10,   1,   3],
        [350, 100,   0, 1.7,  10],
        [500, 100, -10,   1,   3],
        [550, 100, -20,   1,   2],
        [600, 100, -50,   1,   1]
      ]
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
        $scope.theme = name;
      }, 200);       
      $scope.curItem = $scope.wheelControl.select();
      e.preventDefault();
    });   

    /********************************************/

    $scope.openRoot = function() {
      zspin.gui.Shell.openItem(zspin.dataPath());
    };

    // Get current menu's settings
    var settingsFile = zspin.dataPath('Settings', $scope.menu+'.ini');
    ini.parse(settingsFile).then(function(data) {
      $scope.settings = data;
    });

    // Get current menu's entries
    var databaseFile = zspin.dataPath('Databases', $scope.menu, $scope.menu+'.xml');
    var wheelImagesRoot = zspin.dataPath('Media', $scope.menu, 'Images', 'Wheel');
    xml.parse(databaseFile).then(function(database) {
      $scope.database = database;
      $scope.entries = database.menu.game.map(function(item) {
        var name = item.name;
        var path = fs.join(wheelImagesRoot, name+'.png');
        return {name: name, file: path};
      });
    });

  }
]);