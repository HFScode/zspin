'use strict'

app.directive('theme', ['$q', 'zspin', 'fs', 'zip', 'xml',
  function($q, zspin, fs, zip, xml) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'Theme/template.html',
      scope: {
        src: '@',
        video: '@',
      },
      link: function(scope, el, attrs) {

        function updateEntries() {
          if (!scope.src) return;

          // If we don't have file, do nothing
          fs.exists(scope.src).then(function (exists) {
            // If the file does not exist, abort
            if (!exists) { return $q.reject(); }

            // Reset to empty values
            scope.artworks = {};
            scope.configs = {};

            // Create a temporary path for the zip contents
            return fs.mktmpdir();
          }).then(function (tmp) {
            scope.tmp = tmp;
            scope.path = tmp.path;

            // Extract Zip file into temporary folder
            return zip.extract(scope.src, scope.tmp.path);
          }).then(function () {

            // List the extracted entries
            return fs.readdir(scope.tmp.path);
          }).then(function (files) {
            var allowedExts = ['png', 'swf', 'flv'];

            // Parse files entries into usefull objects
            scope.artworks = files.filter(function(file) {
              return allowedExts.indexOf(fs.extname(file)) !== -1;
            }).map(function(file) {
              var path = scope.tmp.path;
              return {name: fs.basenamelc(file), file: fs.join(scope.path, file)};
            });

            // // Add video from static
            // if (scope.video) {
            //   var demo = {name: 'demo', file: scope.demo};
            //   scope.artworks.push(demo);
            // }

            // Load Theme.xml for theme config
            return xml.parse(fs.join(scope.path, 'Theme.xml'));
          }).then(function (config) {

            // Register scope configs in scope
            scope.configs = config.Theme || {};
            // Set default background config
            scope.configs.background = {w: '1024', h: '768'};
            // If we have a demo to play, it will be the same config
            // scope.configs.demo = scope.configs.video;
          });
        }

        // Update entries when theme change
        scope.$watch('src', updateEntries);

      }
    };
  }
]);
