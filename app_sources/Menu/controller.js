'use strict';

app.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'fs', 'zspin', 'menus',
  function($scope, $routeParams, $location, $timeout, fs, zspin, menus) {

    /************* This... is crack. ************/

    //  -  Defining path/current menu
    $scope.path = $routeParams.path;
    $scope.menus = $scope.path.split('/');
    $scope.menu = $scope.menus[$scope.menus.length-1];

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
    $scope.update = function() {
      $timeout.cancel(updatePromise);
      updatePromise = $timeout(function() {
        var name = $scope.curItem.name;
        $scope.theme = zspin.path('Media', $scope.menu, 'Themes', name+'.zip');
        $scope.demo = zspin.path('Media', $scope.menu, 'Video', 'OpenBOR.flv');
      }, 200);
      $scope.curItem = $scope.wheelControl.select();
    };

    /***************************** Wheel Control *****************************/

    $scope.next = function() {
      $scope.wheelControl.next();
      $scope.update();
    };

    $scope.prev = function() {
      $scope.wheelControl.prev();
      $scope.update();
    };

    $scope.enter = function() {
      var newMenu = $scope.curItem.name;
      var newPath = ['', 'menus', $scope.path, newMenu];
      $location.path(newPath.join('/'));
    };

    $scope.back = function() {
      var newMenus = $scope.menus.slice(0, $scope.menus.length-1);
      var newPath = ['', 'menus'].concat(newMenus);
      $location.path(newPath.join('/'));
    };

    /*************************** Settings loading ****************************/

    var menu = menus($scope.menu);
    $scope.demo = zspin.path('Media', $scope.menu, 'Video', 'OpenBOR.flv');

    // Prob for intro video file
    var videoPath = zspin.path('Media', $scope.menu, 'Video');
    $scope.videoPlaceholder = null;
    fs.readdir(videoPath).then(function(files) {
      var videos = files.filter(function(file) {
        return fs.basename(file) === 'no video';
      }).map(function(file) {
        return fs.join(videoPath, file);
      });
      if (videos.length !== 0)
        $scope.videoPlaceholder = videos[0];
    });


    menu.settings().then(function(settings) {
      $scope.settings = settings;
    });

    menu.databases().then(function(databases) {
      $scope.databases = databases;

      // Map databases game enties to jwheel entries
      $scope.entries = databases.menu.game.map(function(item) {
        var filename = menu.mediaPath('Images', 'Wheel', item.name+'.png');
        return {name: item.name, file: filename};
      });

    });

  }
]);