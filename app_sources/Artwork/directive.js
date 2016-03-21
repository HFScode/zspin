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
        });

        // Update styles when config change
        // or once the image size has been found
        scope.$watch('config', function(newv, oldv) {
          computeBox();
        });

        scope.$watch('artwork.size', function(newv, oldv) {
          if (oldv != newv) {computeBox();}
        });

        // Recompute styles when needed
        scope.$watch('box', function(newv, oldv) {
          if (oldv != newv) {updateStyle();}
        });
        scope.$on('resize', updateStyle);

      }
    };
  }
]);