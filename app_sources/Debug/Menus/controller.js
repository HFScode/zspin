'use strict';

app.controller('DebugMenusCtrl', ['$scope', 'zspin', 'fs', 'menus',
  function($scope, zspin, fs, menus) {
    $scope.options = [];
    $scope.menuName = null;
    $scope.menu = {};
    $scope.medias = {};


    // Load ini folder to provide Theme neme options
    fs.glob('*.ini', {cwd: zspin.path('Settings')}).then(function(dirs) {
      $scope.menuName = 'Main Menu';
      $scope.options = dirs.map(function(dir) {
        return dir.replace('.ini', '');
      });
    });

    // Update $scope.menu when select input value changes
    $scope.$watch('menuName', function(name) {
      $scope.menu = menus(name || 'Main Menu');

      $scope.medias = {};
      $scope.mediasPath = 'Themes';
      $scope.mediasPattern = '*.zip';
    });

    // List medias from theme
    $scope.getMedias = function() {
      var path = $scope.mediasPath;
      var pattern = $scope.mediasPattern;
      $scope.menu.getMedias(path, pattern).then(function(files) {
        $scope.medias = files;
      });
    };

  }
]);
