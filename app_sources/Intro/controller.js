'use strict';

app.controller('IntroCtrl', ['$scope', '$location', 'fs', 'zspin',
  function($scope, $location, fs, zspin) {

    // Prepend video file
    var path = zspin.path('Media', 'Frontend', 'Video');

    // Flvplayer interface
    $scope.player = {};

    // Prob for intro video file
    fs.readdir(path).then(function(files) {
      var videos = files.filter(function(file) {
        return fs.basename(file) === 'Intro';
      }).map(function(file) {
        return fs.join(path, file);
      });
      if (videos.length !== 0)
        $scope.video = videos[0];
    });

    // Check for playback status change
    $scope.$watch('player.status.isPlaying', function(isPlaying, wasPlaying) {
      if (!isPlaying && wasPlaying)
        $location.path('/menus/Main Menu');
    });

  }
]);
