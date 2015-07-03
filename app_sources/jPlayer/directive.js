app.directive('jplayer', ['fs',
  function(fs) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div></div>',
      scope: {
        src: '@',
        autoplay: '@',
        loop: '@',
        pauseOthers: '@',
        pause: '=',
        onEnd: '=',
      },
      link: function(scope, element, attrs) {
        var $player = element;
        var videoObj = {};

        var updatePlayer = function(src) {
          if (!src) return;
          var extension = fs.extname(src);
          var type = (extension == 'mp4' ? 'm4v': extension);
          var videoObj = {};
          videoObj[type] = src;

          $player.jPlayer({
            swfPath: 'swf',
            volume: 1,
            supplied: type,
            // errorAlerts: true,
            // warningAlerts: true,
            solution: 'flash', // can be 'html, flash'
            wmode: 'opaque',  // available: window, transparent, opaque, direct, gpu.
            size: {width: '100%', height: '100%'},
            loop: (scope.loop === 'true'),
            autoplay: (scope.autoplay === 'true'),
            ready: function() {
              $player
                .jPlayer('setMedia', videoObj)
                .jPlayer(scope.autoplay === 'true' ? 'play' : 'stop');
            },
            play: function() {
              if (scope.pauseOthers === 'true') {
                $player.jPlayer('pauseOthers');
              }
            },
            pause: function() {
            },
            ended: function() {
              scope.onEnd();
            },
          });
        };

        var playPause = function(pause) {
          if (pause !== 'true' && pause !== 'false') return;
          if (pause === 'true') {
            $player.jPlayer('pause');
          } else {
            $player.jPlayer('play');
          }
        };

        scope.$watch('src', updatePlayer);
        scope.$watch('pause', playPause);

        updatePlayer();
      }
    };
  }
]);