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
          SWFReader.read(scope.file.path, function(err, swf) {
            if (err) {
              d.reject(err);
            } else {
              d.resolve(swf.frameSize);
            }
          });
          return d.promise;
        }

        // Get the size of an <img> by asking the browser
        function getImageSize() {
          var d = $q.defer();
          var $el = $('.theme-entry-item', el);
          $el.on('load', function() {
            d.resolve({
              width  : $el[0].naturalWidth,
              height : $el[0].naturalHeight,
            });
          });
          return d.promise;
        }

        /*------------------------- Get Artwork Size ------------------------*/

        // Size is unknown at this point
        // scope.size = {width: 0, height: 0};

        //  -  Set element's size
        function updateSize(size) {
          scope.size = size;
        }

        scope.$watch('file', function(file) {
          // if file is a flash file
          if (file && file.type === 'swf')
            getFlashSize().then(updateSize);
          // if file is a plain image file
          else if (file && file.type === 'png')
            getImageSize().then(updateSize);
          else if (file && file.type === 'flv') {
            $timeout(function() {
              updateSize({width: 0, hieght: 0});
            }, 100);
          }
         });

        /*------------------------ Set Artwork Style ------------------------*/

        scope.style = {};

        //  -  Set element's css rules
        function updateStyle() {
          scope.style = {};
          // console.log('config', scope.name, scope.config);
          // If we don't have size or config do nothing
          if (!scope.config || !scope.size)
            return;

          var css = {};
          var conf = scope.config;

          // Config simili-parsing
          css.width = (conf.w || scope.size.width || 0);
          css.height = (conf.h || scope.size.height || 0);
          css.left = (conf.x - (css.width / 2)) || 0;
          css.top = (conf.y - (css.height / 2)) || 0;
          if (!!scope.overlay) {
            css.left += ((css.width - scope.size.width) / 2) + parseFloat(conf.overlayoffsetx);
            css.top  += ((css.height - scope.size.height) / 2) + parseFloat(conf.overlayoffsety);
            css.width = (scope.size.width || 0);
            css.height = (scope.size.height || 0);
          }

          // Scale from the original 1024 * 768 to windows size
          var W_RATIO = window.innerWidth / 1024;
          var H_RATIO = window.innerHeight / 768;

          css.width = css.width * W_RATIO;
          css.height = css.height * H_RATIO;
          css.top = css.top * H_RATIO;
          css.left = css.left * W_RATIO;

          scope.style = css;
          if (scope.name == 'video') {
            console.log(conf);
            console.log(css);
          }


          // console.log(scope.name, 'style=', css);
        }

        // Update styles when needed
        scope.$on('resize', updateStyle);
        scope.$watch('size', updateStyle);
        scope.$watch('config', updateStyle);

      }
    };
  }
]);