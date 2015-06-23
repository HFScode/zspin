'use strict';

app.controller('IntroCtrl', ['$scope', '$location', 'fs', 'settings', 'fileServer', '$timeout',
  function($scope, $location, fs, settings, fileServer, $timeout) {

    // Prepend video file
    var path = settings.hsPath('Media', 'Frontend', 'Video');

    $scope.player = null;

    // videojs options
    $scope.vjsOptions = {
      'flash': {
        'swf': 'video-js.swf',
      },
      'autoplay': true,
      'techOrder': ['flash'],
    };

    // Prob for intro video file
    fs.readdir(path).then(function(files) {
      var videos = files.filter(function(file) {
        return fs.basename(file) === 'Intro';
      }).map(function(file) {
        return fs.join(path, file);
      });
      if (videos.length !== 0) {
        fileServer.serveFile(fs.filename(videos[0]), videos[0]);
        $scope.videoExt = fs.extname(videos[0]);
        $scope.videoUrl = fileServer.url+'/'+fs.filename(videos[0]);

        $timeout(function() {
          $scope.player = videojs('introvideo', $scope.vjsOptions, function() {});
          $scope.player.on('ended', function () {
            $location.path('/menus/Main Menu');
          });
        });

      }
    });

    function stopVideo() {
      // $scope.player.pause();
      $location.path('/menus/Main Menu');
    }

    $scope.$on('input:enter', stopVideo);
    $scope.$on('input:back', stopVideo);

  }
]);
