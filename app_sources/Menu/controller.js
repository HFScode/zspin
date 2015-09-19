'use strict';

app.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'fs', 'menus', 'settings', 'inputs', 'zspin', 'themes', 'fileServer',
  function($scope, $routeParams, $location, $timeout, fs, menus, settings, inputs, zspin, themes, fileServer) {

    //  - requires
    var $fs = require('fs');
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
    $scope.useDefault = false;

    //  -  Defining wheel parameters  -
    $scope.wheelOptions = {
      // animation time in ms
      transitionTime: 70,
      hide: true,
      hideStart: 1000,
      hideDuration: 500,
      // index of item which serves as cursor
      selectPosition: 9,
      points: [
        // X%, Y%, scale, z-index, transform css
        // first item offscreen but required for animation
        [146,45, 1, 1, 'rotate(0deg)'],  [91, -10, 1, 2, 'rotate(23deg)'],
        [87, -3, 1, 3, 'rotate(21deg)'],  [84, 3,  1, 4, 'rotate(18deg)'],
        [81, 10, 1, 5, 'rotate(15deg)'],  [79, 16, 1, 6, 'rotate(12deg)'],
        [77, 23, 1, 7, 'rotate(9deg)'],  [ 76, 29, 1, 8, 'rotate(6deg)'],
        [75, 36, 1, 9, 'rotate(3deg)'],   [75, 45, 2, 10, 'rotate(0)'],
        [75, 54, 1, 9, 'rotate(-3deg)'],  [76, 60, 1, 8, 'rotate(-6deg)'],
        [77, 67, 1, 7, 'rotate(-9deg)'],  [79, 73, 1, 6, 'rotate(-12deg)'],
        [81, 80, 1, 5, 'rotate(-15deg)'], [84, 86, 1, 4, 'rotate(-18deg)'],
        [87, 93, 1, 3, 'rotate(-21deg)'], [91, 99, 1, 2, 'rotate(-23deg)'],
      ]
    };

    var binds = [];

    // Wait before considering an entry menu as selected
    // Cancel any previous running timer
    var updatePromise;
    $scope.updateEntry = function() {
      $timeout.cancel(updatePromise);
      updatePromise = $timeout(function() {
        $scope.curEntry = $scope.wheelControl.select().name;
        $scope.curTheme = $scope.themes[$scope.curEntry] ||
                          $scope.themes['Default'] ||
                          $scope.themes['default'] ||
                          $scope.curTheme;
      }, 500);
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
      if ($fs.existsSync(databasePath, $fs.F_OK)) {
        zspin.menuHistory[menu.name] = elem;
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

    binds.up = $scope.$on('input:up', $scope.prev);
    binds.down = $scope.$on('input:down', $scope.next);
    binds.left = $scope.$on('input:left', $scope.prevLetter);
    binds.right = $scope.$on('input:right', $scope.nextLetter);
    binds.enter = $scope.$on('input:enter', $scope.enter);
    binds.back = $scope.$on('input:back', $scope.back);

    /*************************** Database loading ****************************/

    // Load menu database
    $scope.$watch('menu.databases', function(databases) {
      if (!databases) return;

      // load index for wheel
      if (zspin.menuHistory[menu.name] !== undefined) {
        $scope.wheelOptions.startElem = zspin.menuHistory[menu.name];
      }

      // Databases Game enties to jwheel entries (with image)
      $scope.menu.getMedias('Images/Wheel', '*').then(function(files) {
        $scope.entries = databases.menu.game.map(function(e) {
          return {name: e.name, file: files[e.name]};
        });
      });

      // Pre-Load available themes
      $scope.menu.getMedias('Themes', '*.zip').then(function(files) {
        $scope.themes = files;
        $scope.isDefault = $scope.themes['Default'] !== undefined ||
                           $scope.themes['default'] !== undefined;
      });

      // Load params for wheel if available
      $scope.menu.getWheel().then(function(data) {
        var tmp = [];
        if (data.type === 'horizontal') {
          // rebind events corresponding to horizontal menu
          binds.up(); binds.down(); binds.left(); binds.right();
          binds.up = $scope.$on('input:up', $scope.prevLetter);
          binds.down = $scope.$on('input:down', $scope.nextLetter);
          binds.left = $scope.$on('input:left', $scope.prev);
          binds.right = $scope.$on('input:right', $scope.next);
        }

        for (var i in data.points) {
          tmp.push([
            data.points[i].x,
            data.points[i].y,
            data.points[i].scale,
            data.points[i].index,
            data.points[i].transform
          ]);
        }
        data.points = tmp;
        $scope.wheelOptions = data;
      });

    });

    // Force load first theme
    $scope.$watch('entries', function(entries) {
      if (!entries) return;

      $scope.curEntry = zspin.menuHistory[menu.name] || entries[0].name;
      $scope.curTheme = $scope.themes[$scope.curEntry] ||
                        $scope.themes['Default'] ||
                        $scope.themes['default'] ||
                        $scope.curTheme;
    });

    //remove binds on destroy
    $scope.$on('$destroy', function() {
      for (var i in binds) {
        binds[i]();
      }
    });
  }
]);