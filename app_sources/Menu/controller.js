'use strict';

app.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'fs', 'menus', 'settings', 'inputs', 'zspin', 'themes', 'dataServer',
  function($scope, $routeParams, $location, $timeout, fs, menus, settings, inputs, zspin, themes, dataServer) {

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
    $scope.infos = {};
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
        // first item offscreen but required for animation
        {x: 146, y: 45, scale: 1, zIndex: 1, rotation:0},
        {x: 91, y:-10, scale:1, zIndex:2, rotation:23},
        {x: 87, y:-3, scale:1, zIndex:3, rotation:21},
        {x: 84, y:3,  scale:1, zIndex:4, rotation:18},
        {x: 81, y:10, scale:1, zIndex:5, rotation:15},
        {x: 79, y:16, scale:1, zIndex:6, rotation:12},
        {x: 77, y:23, scale:1, zIndex:7, rotation:9},
        {x: 76, y:29, scale:1, zIndex:8, rotation:6},
        {x: 75, y:35, scale:1, zIndex:9, rotation:3},
        {x: 65, y:39, scale:1.8, zIndex:10, rotation:0},
        {x: 75, y:54, scale:1, zIndex:9, rotation:-3},
        {x: 76, y:60, scale:1, zIndex:8, rotation:-6},
        {x: 77, y:67, scale:1, zIndex:7, rotation:-9},
        {x: 79, y:73, scale:1, zIndex:6, rotation:-12},
        {x: 81, y:80, scale:1, zIndex:5, rotation:-15},
        {x: 84, y:86, scale:1, zIndex:4, rotation:-18},
        {x: 87, y:93, scale:1, zIndex:3, rotation:-21},
        {x: 91, y:99, scale:1, zIndex:2, rotation:-23},
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
        dataServer.infos = $scope.infos[$scope.curEntry];
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
          $scope.infos[e.name] = e;
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
      dataServer.infos = $scope.infos[$scope.curEntry];
    });

    //remove binds on destroy
    $scope.$on('$destroy', function() {
      for (var i in binds) {
        binds[i]();
      }
    });
  }
]);