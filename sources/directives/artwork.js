app.directive('artwork', [
  function() {

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
          console.log('hey', scope.name, scope.file);
        scope.onload = function() {
          console.log('onload', scope.name, scope.file);
          var css = {};
          // Copy conf
          if (!scope.config)
            return;
          var conf = scope.config;
          // Try to get item natural dimesions
          var $el = $('.theme-entry#'+scope.name, el);
          if ($el.length) {
            var width  = $el[0].naturalWidth;
            var height = $el[0].naturalHeight;
          }
          // Config simili-parsing
          if (scope.name == 'background') {
            css.width = '1024px';
            css.height = '768px';
          } else {
            css.width = (conf.w||width||0);
            css.height = (conf.h||height||0);
          }
          css.left = (conf.x-(css.width/2)) || 0;
          css.top = (conf.y-(css.height/2)) || 0;

          css.left = css.left * window.innerWidth / 1024;
          css.top = css.top * window.innerHeight / 768;

          // console.log('done', scope.name, css);
          scope.style = css;
        };

      }
    };
  }
]);