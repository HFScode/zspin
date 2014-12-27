'use strict'

app.directive('theme', ['fs', 'zip', 'xml',
  function(fs, zip, xml) {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'theme.html',
      scope: {
        theme: '=',
      },
      link: function(scope, el, attr) {
    

        scope.$watch('theme', function(theme) {
          scope.zip = null;
          scope.path = null;
          scope.entries = null;
          scope.params = null;
          if (!theme) return;

          scope.path = theme;
          fs.stat(scope.path).then(function(stat) {
            console.log('theme - zip file exists');
            scope.zip = zip(scope.path);
            scope.entries = scope.zip.getEntries().map(function(i) {
              return i.entryName;
            });
            return scope.zip.readFile('Theme.xml');
          }).then(function(data) {
            return xml.parseString(data);
          }).then(function(data) {
            scope.params = data;
          });

        });

      }
    };
  }
]);
