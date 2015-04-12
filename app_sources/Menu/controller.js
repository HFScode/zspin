'use strict';

app.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'fs', 'zspin', 'menus',
  function($scope, $routeParams, $location, $timeout, fs, zspin, menus) {

    /************* This... is crack. ************/

    //  -  Defining path/current menu
    var baseUrl = '/menus/';
    var curPath = $routeParams.path;
    var name = curPath.split('/').pop();
    $scope.menuName = name;

    //  - Retrieve the menu service item
    var menu = $scope.menu = menus(name);
    $scope.curTheme = undefined;
    $scope.curVideo = undefined;

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

    // Wait before considering an entry menu as selected
    // Cancel any previous running timer
    var updatePromise;
    $scope.updateEntry = function() {
      $timeout.cancel(updatePromise);
      updatePromise = $timeout(function() {
        var entryName = $scope.curEntry.name;
        $scope.curTheme = $scope.themes[entryName] || $scope.themes['default'];
      }, 200);
      $scope.curEntry = $scope.wheelControl.select();
    };

    /***************************** Wheel Control *****************************/

    $scope.next = function() {
      $scope.wheelControl.next();
      $scope.updateEntry();
    };

    $scope.prev = function() {
      $scope.wheelControl.prev();
      $scope.updateEntry();
    };

    $scope.enter = function() {
      var newMenu = $scope.curItem.name;
      var newPath = baseUrl + curPath + newMenu;
      $location.path(newPath);
    };

    $scope.back = function() {
      var newPath = baseUrl + curPath;
      $location.path(newPath);
    };

    /*************************** Database loading ****************************/

    // Load menu database
    $scope.$watch('menu.databases', function(databases) {
      if (!databases) return;

      // Databases Game enties to jwheel entries (with image)
      $scope.menu.getMedias('Images/Wheel', '*').then(function(files) {
        $scope.entries = databases.menu.game.map(function(e) {
          return {name: e.name, file: files[e.name]};
        });
      });

      // Pre-Load available themes
      $scope.menu.getMedias('Themes', '*.zip').then(function(files) {
        $scope.themes = files;
      });

    });

  }
]);