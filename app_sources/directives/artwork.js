app.directive('artwork', ['$q', '$timeout', 'fs',
  function($q, $timeout, fs) {
    var SWFReader = require('swf-reader');

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'artwork.html',
      scope: {
        name: '=',
        config: '=',
        file: '=',
        overlay: '=',
      },
      link: function(scope, el, attrs) {

        // Get the size of a .swf (w,h) by parsing the file
        function getFlashSize() {
          var d = $q.defer();
          var path = scope.file.path;
          SWFReader.read(scope.file.path, function(err, res) {
            if (err) { d.reject(err); }
            else { d.resolve(res.frameSize); }
          });
          return d.promise;
        }

        function getVideoSize() {
          var d = $q.defer();
          $timeout(d.resolve, 0);
          return d.promise;
        }


        // Get the size of an <img> by asking the browser
        function getImageSize() {
          var d = $q.defer();
          var $el = el.find('.theme-entry-item');
          $el.on('load', function(e) {
            d.resolve({
              width  : e.target.naturalWidth,
              height : e.target.naturalHeight,
            });
          });
          return d.promise;
        }

        /*------------------------- Get Artwork Size ------------------------*/

        scope.size = null;

        function updateSize(size) {
          console.log('topdelire', scope.name);
          scope.size = size || {};
          updateStyle();
        }

        scope.$watch('file', function(file) {
          // if file is a flash file
          if (file && file.type === 'swf')
            getFlashSize().then(updateSize);
          // if file is a plain image file
          else if (file && file.type === 'png')
            getImageSize().then(updateSize);
          // if the image is a flash video
          else if (file && file.type === 'flv')
            getVideoSize().then(updateSize);
         });

        /*------------------------ Set Artwork Style ------------------------*/

        scope.style = {display: 'none'};

        // Conpute & Set element's css rules
        function updateStyle() {
          scope.style = {display: 'none'};
          console.log('>',  scope.name, scope.config, scope.size);
          // If we miss either config or size, abort
          if (!scope.config || !scope.size)
            return ;

          // Init variables
          var css = {};
          var conf = scope.config;

          // Original artork size might be overrided in config
          // otherwise, use the native artwork size
          css.width  = (conf.w || scope.size.width || 0);
          css.height = (conf.h || scope.size.height || 0);

          // Position (x,y) is defined as the position of the center
          // of the resized artwork relative to window (top,left)
          // posX = x - (width / 2)
          css.left = (conf.x - (css.width / 2)) || 0;
          css.top = (conf.y - (css.height / 2)) || 0;

          // If the item is an overlay, the previously parsed config
          // is its artorwk's and the actual size and position can be
          // deduced from it.
          if (scope.overlay === true) {
            // By default, the overlay has its center aligned with the artwork's center
            css.left = css.left + ((css.width - scope.size.width) / 2);
            css.top  = css.top + ((css.height - scope.size.height) / 2);
            // Apply overlay offsets if any
            css.left += parseInt(conf.overlayoffsetx);
            css.top += parseInt(conf.overlayoffsety);
            // The overlay size is its native one
            css.width = (scope.size.width || 0);
            css.height = (scope.size.height || 0);
          }

          // Scale from the Hyperspin's 1024 * 768 to zspin window size
          var W_RATIO = window.innerWidth / 1024;
          var H_RATIO = window.innerHeight / 768;

          css.width = css.width * W_RATIO;
          css.height = css.height * H_RATIO;
          css.top = css.top * H_RATIO;
          css.left = css.left * W_RATIO;

          scope.style = css;
        }

        // Update styles when needed
        scope.$on('resize', updateStyle);
        // scope.$watch('size', updateStyle);
        scope.$watch('config', updateStyle);

      }
    };
  }
]);