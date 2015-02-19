'use strict';

app.controller('DebugMenusCtrl', ['$scope', 'zspin', 'fs', 'menus',
  function($scope, zspin, fs, menus) {
    $scope.menuName = 'Main Menu';

    $scope.menu = {};
    $scope.settings = {};
    $scope.databases = {};

    fs.readdir(zspin.path('Settings')).then(function(dirs) {
      $scope.options = dirs.map(function(dir) {
        return dir.replace('.ini', '');
      });
    });

    $scope.update = function() {
      $scope.menu = menus($scope.menuName);
      $scope.settings = {};
      $scope.menu.settings().then(function(data) {
        $scope.settings = data;
      });
      $scope.databases = {};
      $scope.menu.databases().then(function(data) {
        $scope.databases = data;
      });
      $scope.videos = {};
      $scope.menu.videos().then(function(videos) {
        $scope.videos = videos;
      });


    };
  }
]);
