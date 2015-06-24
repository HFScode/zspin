'use strict'

app.directive('theme', ['$q', 'settings', 'fs', 'zip', 'themes', 'fileServer',
  function($q, settings, fs, zip, themes, fileServer) {

    return {
      restrict: 'E',
      templateUrl: 'Theme/template.html',
      scope: {
        src: '@',
        menu: '@',
      },
      link: function(scope, el, attrs) {
        scope.tmpRoot = settings.hsPath(settings.$obj.cachePath, 'Theme');
        scope.tmpPath = scope.tmpRoot;
        scope.fileServerUrl = fileServer.url;

        // Update scope.theme when src attribute change
        scope.$watch('src', function(src) {
          if (!src) return;

          var path = fs.dirname(src);
          var name = scope.name || fs.basename(src);

          // Create new tmpPath, extract & load
          scope.tmpPath = fs.join(scope.tmpRoot, name);
          fs.mkdir(scope.tmpPath).then(function() {
            return zip.extract(src, scope.tmpPath);
          }).then(function() {
            scope.theme = themes(scope.tmpPath, scope.menu, name);
          });

        });

      }
    };
  }
]);
