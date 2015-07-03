'use strict';

app.controller('IntroCtrl', ['$scope', '$location', 'fs', 'settings', 'fileServer', '$timeout',
  function($scope, $location, fs, settings, fileServer, $timeout) {

    // Prepend video file
    var path = settings.hsPath('Media', 'Frontend', 'Video');

    // Prob for intro video file
    fs.readdir(path).then(function(files) {
      var videos = files.filter(function(file) {
        return fs.basename(file) === 'Intro';
      }).map(function(file) {
        return fs.join(path, file);
      });
      if (videos.length !== 0) {
        $scope.videoSrc = videos[0];
      }
    });

    $scope.mainMenu = function() {
      $scope.$evalAsync(function() {
        $location.path('/menus/Main Menu');
      });
    };

    $scope.$on('input:enter', $scope.mainMenu);
    $scope.$on('input:back', $scope.mainMenu);

  }
]);
