'use strict';

app.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$document', '$timeout', 'fs', 'zspin', 'ini', 'xml',
  function($scope, $routeParams, $location, $document, $timeout, fs, zspin, ini, xml, gamepads) {

    /************* This... is crack. ************/

    //  -  Defining path/current menu
    $scope.path = $routeParams.path;
    $scope.menus = $scope.path.split('/');
    $scope.menu = $scope.menus[$scope.menus.length-1];
    console.log('local', $scope.path, $scope.menu);

    //  -  Defining wheel parameters  -
    $scope.wheelItems = [];
    $scope.wheelOptions = {
      // animation time in s
      transitionTime: 0.07,
      // index of item which serves as cursor
      selectPosition: 9,
      points: [
        // X, Y, Angle, Scale, z-index
        // first item offscreen but required for animation
        [1500, 344, 0, 1, 1],
        [930, -76, 23, 1, 2],
        [890, -26, 21, 1, 3],
        [860, 24, 18, 1, 4],
        [830, 74, 15, 1, 5],
        [810, 124, 12, 1, 6],
        [795, 174, 9, 1, 7],
        [780, 224, 6, 1, 8],
        [773, 274, 3, 1, 9],
        // next item is the selection cursor
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

    $scope.update = function() {
      // Wait before considering an entry menu as selected
      // Cancel any previous running timer
      $timeout.cancel(updatePromise);
      updatePromise = $timeout(function() {
        var name = $scope.curItem.name;
        $scope.theme = name;
      }, 200);
      $scope.curItem = $scope.wheelControl.select();
    };

    $scope.next = function() {
      $scope.wheelControl.next();
      $scope.update();
    };

    $scope.prev = function() {
      $scope.wheelControl.prev();
      $scope.update();
    };

    //  -  Binding controls  -
    $document.bind('keydown', function(e) {
      if (!$scope.wheelControl)
        return;

      // enter key
      if (e.which == 13) {
        var newMenu = $scope.wheelControl.select();
        var newPath = '/menus/' + $scope.path + '/' + newMenu.name;
        $location.path(newPath);
      }

      // escape key
      if (e.which == 27) { // WHY THIS SHIT GETS CALLED 2 TIMES IN SUBWHEEL
        if ($scope.menus.length <= 1) return;
        var newMenus = $scope.menus.slice(0, $scope.menus.length-1);
        var newPath = '/menus/' + newMenus.join('/');
        $location.path(newPath);
      }

      e.preventDefault();
    });

    $scope.openRoot = function() {
      zspin.gui.Shell.openItem(zspin.dataPath());
    };

    //  -  Get current menu's settings  -
    var settingsFile = zspin.dataPath('Settings', $scope.menu+'.ini');
    ini.parse(settingsFile).then(function(data) {
      $scope.settings = data;
    });

    //  -  Get current menu's entries  -
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