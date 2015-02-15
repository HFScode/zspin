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

        function extname(filename) {
          return filename.toLowerCase().replace(/^.*\./, '');
        }
        function basename(filename) {
          return filename.toLowerCase().replace(/\..*?$/, '');
        }

        function tmp_path () {
          return fs.join.bind(fs, scope.tmp.path).apply(fs, arguments);
        }

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

            // Extract Zip file into temporary folder
            return zip.extract(scope.src, scope.tmp.path);
          }).then(function () {

            // List the extracted entries
            return fs.readdir(scope.tmp.path);
          }).then(function (files) {
            var allowedExts = ['png', 'swf', 'flv'];

            // Parse files entries into usefull objects
            scope.artworks = files.filter(function(file) {
              return allowedExts.indexOf(extname(file)) !== -1;
            }).map(function(file) {
              return {name: basename(file), file: tmp_path(file)};
            });

            // Load Theme.xml for theme config
            var configPath = fs.join(scope.tmp.path, 'Theme.xml');
            return xml.parse(configPath);
          }).then(function (config) {

            // Save config in scope
            scope.configs = config.Theme || {};
            scope.configs.background = {w: '1024', h: '768'};
          });
        }

        // Update entries when theme change
        scope.$watch('src', updateEntries);

      }
    };
  }
]);
