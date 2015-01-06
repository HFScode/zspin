'use strict';

app.controller('MenuCtrl', ['$scope', '$document', '$timeout', 'fs', 'zspin', 'ini', 'xml',
  function($scope, $document, $timeout, fs, zspin, ini, xml) {
    $scope.menu = 'Main Menu';

    /************* This... is crack. ************/

    $scope.wheelItems = [];
    $scope.wheelOptions = {
      transitionTime: 70, // in ms
      selectPosition: 9,   // index of item which serves as cursor
      points: [            
        // X, Y, Angle, Scale, z-index
        [1500, 344, 0, 1, 1], // offscreen but required
        [930, -76, 23, 1, 2],
        [890, -26, 21, 1, 3],
        [860, 24, 18, 1, 4],
        [830, 74, 15, 1, 5],
        [810, 124, 12, 1, 6],
        [795, 174, 9, 1, 7],
        [780, 224, 6, 1, 8],
        [773, 274, 3, 1, 9],
        [770, 344, 0, 2, 10],
        [773, 414, -3, 1, 9],
        [780, 464, -6, 1, 8],
        [795, 514, -9, 1, 7],
        [810, 564, -12, 1, 6],
        [830, 614, -15, 1, 5],
        [860, 664, -18, 1, 4],
        [890, 714, -21, 1, 3],
        [930, 764, -23, 1, 2],
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