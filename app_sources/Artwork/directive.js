app.directive('artwork', ['$q', 'artworks', '$timeout',
  function($q, artworks, $timeout) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'Artwork/template.html',
      scope: {
        src: '@',
        config: '=',
        overlay: '@',
      },
      link: function(scope, el, attrs) {

        /*---------------------- Set Artwork css Style ----------------------*/
        scope.style = {opacity: 0};

        var vjsOptions = {
          'flash': {
            'swf': 'video-js.swf',
          },
          'autoplay': true,
          'loop': true,
          'techOrder': ['flash'],
        };

        function computeBox() {
          if (!scope.config || !scope.artwork)
            return;
          scope.box = artworks.computeBox(scope.artwork, scope.config, scope.overlay);
        }

        function updateStyle() {
          var css = {};

          // Scale from the Hyperspin's 1024 * 768 to zspin window size
          var W_RATIO = window.innerWidth / 1024;
          var H_RATIO = window.innerHeight / 768;

          css.width  = scope.box.width * W_RATIO;
          css.height = scope.box.height * H_RATIO;
          css.top    = scope.box.top * H_RATIO;
          css.left   = scope.box.left * W_RATIO;
          scope.style = css;
        }

        // Update artwork on source change
        scope.$watch('src', function(src) {
          scope.artwork = artworks(src);

          if (scope.artwork.type == 'flv' || scope.artwork.type == 'mp4') {
            // wait for rendering
            $timeout(function() {

              // I don't like this, but videojs you know...
              // this kills existing videojs player, because we cannot change
              // source directly (fails in current videojs build)
              // so we dispose it and recreate it with the new video
              if (artworks.player !== null && artworks.player.cache_ !== undefined) {
                artworks.player.dispose();
              }

              artworks.player = videojs('artworkvideo', vjsOptions, function() {
                this.src({src: scope.artwork.src, type: "video/"+scope.artwork.type});
                artworks.player = this;
              }).ready(function() {
                // here we remove the videojs generated style, there is no other
                // way to do this at this time FUUUUU
                $('#video style').remove();
              });

            });
          }

        });

        // Update styles when config change
        // or once the image size has fbeen found
        scope.$watch('config', computeBox);
        scope.$watch('artwork.size', computeBox);

        // Recompute styles when needed
        scope.$watch('box', updateStyle);
        scope.$on('resize', updateStyle);

      }
    };
  }
]);