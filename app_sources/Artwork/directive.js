app.directive('artwork', ['$q', 'artworks',
  function($q, artworks) {
    var SWFReader = require('swf-reader');

    return {
      restrict: 'E',
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
          if (!scope.config.w && !scope.artwork.size)
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
          console.log('oh', scope.src, scope.config)
          scope.artwork = artworks(src);
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