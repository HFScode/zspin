app.directive('artwork', ['fs',
  function(fs) {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'artwork.html',
      scope: {
        name: '=',
        config: '=',
        file: '=',
      },
      link: function(scope, el, attrs) {

        scope.size = {width: 0, height: 0};


        scope.$watch('file', function(file) {

          if (file && file.type === 'swf') { 
            SWFReader.read(file.path, function(err, swf) {
              console.log('swf loaded', err);
              scope.$apply(function() {
                scope.size = swf.frameSize;
              });
            });
          }

          if (file && file.type !== 'swf') {
            var $el = $('.theme-entry-item', el)
            $el.on('load', function() {
              scope.$apply(function() {
                scope.size = {
                  width  : $el[0].naturalWidth,
                  height : $el[0].naturalHeight,
                };
                console.log('img loaded');
              });
            });
          }

        });


        scope.$watch('size', function() {
          console.log('onload', scope.name, scope.file);
          var css = {};
          // Copy conf
          if (!scope.config)
            return;
          var conf = scope.config;
          // Try to get item natural dimesions
          // Config simili-parsing
          css.width = (conf.w||scope.size.width||0);
          css.height = (conf.h||scope.size.height||0);
          css.left = (conf.x-(css.width/2)) || 0;
          css.top = (conf.y-(css.height/2)) || 0;

          css.width = css.width * window.innerWidth / 1024;
          css.height = css.height * window.innerHeight / 768;

          css.left = css.left * window.innerWidth / 1024;
          css.top = css.top * window.innerHeight / 768;

          console.log('done', scope.name, css);
          scope.style = css;
        });

      }
    };
  }
]);