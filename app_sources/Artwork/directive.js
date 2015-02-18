app.directive('artwork', ['$q', '$timeout', 'fs',
  function($q, $timeout, fs) {
    var SWFReader = require('swf-reader');

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'Artwork/template.html',
      scope: {
        src: '@',
        config: '=',
        overlay: '@',
      },
      link: function(scope, el, attrs) {

        // Get the size of a .swf (w,h) by parsing the src
        scope.getFlashSize = function() {
          SWFReader.read(scope.src, function(err, res) {
            scope.$apply(function() {
              scope.naturalSize = res && res.frameSize;
            });
          });
        };

        // Get the size of an <img> by asking the browser
        scope.getImageSize = function() {
          var $el = el.find('.Artwork-item');
          scope.naturalSize = {
            width  : $el[0].naturalWidth,
            height : $el[0].naturalHeight,
          };
        };

        /*------------------------- Get Artwork Size ------------------------*/
        scope.naturalSize = null;

        function updateType() {
          scope.type = fs.extname(scope.src||'');
          scope.naturalSize = null;
          if (scope.type === 'swf')
            scope.getFlashSize();
          if (scope.type === 'flv')
            scope.naturalSize = {width: 200, height: 200};
          // if (scope.type === 'png')
          //   scope.getImageSize();
        }

        /*--------------------- Set Artwork Bounding Box --------------------*/

        scope.box = {};
        // Conpute & Set element's css rules
        function updateBox() {
          scope.box = {};
          // If we miss either config or size, abort
          if (!scope.config || !scope.naturalSize)
            return ;

          // Init variables
          var box = {};
          var conf = scope.config;

          // Original artork size might be overrided in config
          // otherwise, use the native artwork size
          box.width  = (conf.w || scope.naturalSize.width || 0);
          box.height = (conf.h || scope.naturalSize.height || 0);

          // Position (x,y) is defined as the position of the center
          // of the resized artwork relative to window (top,left)
          // posX = x - (width / 2)
          box.left = (conf.x - (box.width / 2)) || 0;
          box.top = (conf.y - (box.height / 2)) || 0;

          // If the item is an overlay, the previously parsed config
          // is its artorwk's and the actual size and position can be
          // deduced from it.
         if (scope.overlay && scope.overlay !== 'false') {
            // By default, the overlay has its center aligned with the artwork's center
            box.left = box.left + ((box.width - scope.naturalSize.width) / 2);
            box.top  = box.top + ((box.height - scope.naturalSize.height) / 2);
            // Apply overlay offsets if any
            box.left += parseInt(conf.overlayoffsetx);
            box.top += parseInt(conf.overlayoffsety);
            // The overlay size is its native one
            box.width = (scope.naturalSize.width || 0);
            box.height = (scope.naturalSize.height || 0);
          }

          scope.box = box;
          updateStyle();
        }

        /*---------------------- Set Artwork css Style ----------------------*/

        scope.style = {opacity: 0};

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

        // Update type detection
        scope.$watch('src', updateType);
        // Update styles when needed
        scope.$watch('config', updateBox);
        scope.$watch('naturalSize', updateBox);
        // Rescale styles when needed
        scope.$on('resize', updateStyle);

      }
    };
  }
]);