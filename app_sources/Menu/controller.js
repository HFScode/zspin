'use strict';

app.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'fs', 'menus', 'settings', 'inputs', 'zspin',
  function($scope, $routeParams, $location, $timeout, fs, menus, settings, inputs, zspin) {

    //  - requires
    var fsRaw = require('fs');
    var spawn = require('child_process').spawn;

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
    $scope.wheelOptions = {
      // animation time in ms
      transitionTime: 70,
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
        $scope.curTheme = $scope.themes[entryName] || $scope.themes['default'] || $scope.curTheme;
      }, 200);
      $scope.curEntry = $scope.wheelControl.select();
    };

    /***************************** Wheel Control *****************************/

    $scope.next = function() {
      $scope.wheelControl.move('next');
      $scope.updateEntry();
    };

    $scope.prev = function() {
      $scope.wheelControl.move('prev');
      $scope.updateEntry();
    };

    $scope.prevLetter = function() {
      $scope.wheelControl.moveToLetter('prev');
      $scope.updateEntry();
    };

    $scope.nextLetter = function() {
      $scope.wheelControl.moveToLetter('next');
      $scope.updateEntry();
    };


    $scope.enter = function() {
      var elem = $scope.wheelControl.select().name;

      // check if item is a database, if yes, go to submenu
      var databasePath = settings.hsPath('Databases', elem, elem+'.xml');
      if (fsRaw.existsSync(databasePath)) {
        var newPath = baseUrl + curPath + '/' + elem;
        $location.path(newPath);

      // if not, then this is a game, run it
      } else {
        var params = settings.$obj.launcherParams.split(' ');

        for (var i=0; i < params.length; i++) {
          params[i] = params[i].replace('{rom}', elem)
                               .replace('{system}', menu.name);
        }

        spawn(settings.$obj.launcherPath, params);
        inputs.isWindowFocused = false;
      }
    };

    $scope.back = function() {
      if (curPath.indexOf('/') > -1) {
        curPath = curPath.split('/').slice(0, -1).join('/');
      } else {
        zspin.quit();
      }
      var newPath = baseUrl + curPath;
      $location.path(newPath);
    };

    $scope.$on('input:up', $scope.prev);
    $scope.$on('input:down', $scope.next);
    $scope.$on('input:left', $scope.prevLetter);
    $scope.$on('input:right', $scope.nextLetter);
    $scope.$on('input:enter', $scope.enter);
    $scope.$on('input:back', $scope.back);

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

      // Load params for wheel if available
      $scope.menu.getWheel().then(function(data) {
        var tmp = [];
        for (var i in data.points) {
          tmp.push([
            data.points[i].x,
            data.points[i].y,
            data.points[i].angle,
            data.points[i].scale,
            data.points[i].index
          ]);
        }
        data.points = tmp;
        $scope.wheelOptions = data;
      });

    });

    // Force load first theme
    $scope.$watch('entries', function(entries) {
      if (!entries) return;
      $scope.curTheme = $scope.themes[entries[0].name];
    });

  }
]);