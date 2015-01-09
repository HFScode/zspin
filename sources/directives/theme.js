'use strict'

app.directive('theme', ['zspin', 'fs', 'zip', 'xml',
  function(zspin, fs, zip, xml) {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'theme.html',
      scope: {
        menu: '=',
        theme: '=',
      },
      link: function(scope, el, attrs) {

        // From a filenames list, create an hashmap of usefull objects
        // ie: "Artwork2.swf"
        // {name: 'artwork2', type: 'swf', file: 'Artwork2.swf', path: "/path/to/Artwork2.swf"}
        function parseFileEntries(path, files) {
          var items = {};

          for (var idx in files) {
            var file = files[idx];
            var base = file.toLowerCase();
            var item = {
              file: file,
              path: fs.join(path, file),
              type: base.replace(/^.*\./, ''),
              name: base.replace(/\..*?$/, ''),
            };
            items[item.name] = item;
          }
          return items;
        }

        // From a config object, group entries by categories
        // ie : {
        //   'video': /* video config */
        //   'artworks': {
        //      'artwork2': /* artwork2 config */
        //    }
        // }
        function parseConfigEntries(config) {
          var items = {
            video: null,
            arworks: {},
            background: null,
          };

          // Entry name is category(index) eg: "artwork2", "video"
          var regxp = new RegExp('([a-z]*)([0-9]*)');

          // Parse entries from name and put them in their respective catgories
          var names = Object.keys(config);
          names.forEach(function(name) {
            var match = name.match(regxp);
            if (match && match[1] === 'artwork')
              scope.artworks[name] = config[name];
            if (match && match[1] === 'video')
              scope.video = config.video;
          });

          return items;
        }


        function updateEntries(theme) {
          // If we don't have theme or menu do nothing
          if (!scope.theme || !scope.menu)
            return;

          // Set path to current menu & theme path
          var zipPath = zspin.dataPath('Media', scope.menu, 'Themes', scope.theme+'.zip');
          if (scope.zipPath === zipPath)
            return;

          // Check if zipPath exists
          fs.stat(zipPath).then(function (stat) {
            // Reset to empty values
            scope.files = {};
            scope.config = {};
            scope.artworks = {};
            // Set current zipPath
            scope.zipPath = zipPath;

            // Create a temporary path for the zip contents
            return fs.mktmpdir();

          }).then(function (tmp) {
            scope.tmp = tmp;
            // Extract Zip file into temporary folder
            return zip.extract(zipPath, scope.tmp.path);

          }).then(function () {
            // List the extracted entries
            return fs.readdir(scope.tmp.path);

          }).then(function (files) {
            // Parse files entries into usefull objects
            scope.files = parseFileEntries(scope.tmp.path, files);
            console.log(scope.theme, 'files=', scope.files);

            // Load Theme.xml for theme config
            var themeXml = fs.join(scope.tmp.path, 'Theme.xml');
            return xml.parse(themeXml);

          }).then(function (config) {
            // Save config in scope
            scope.config = config.Theme || {};
            console.log(scope.theme, 'config=', scope.config);

            // Parse config entries into usefull objects
            angular.extend(scope, parseConfigEntries(scope.config));
            console.log(scope.theme, 'artworks=', scope.artworks);
            console.log(scope.theme, 'video=', scope.video);
          });
        }

        // Update entries when theme change
        scope.$watch('theme', updateEntries);

      }
    };
  }
]);
