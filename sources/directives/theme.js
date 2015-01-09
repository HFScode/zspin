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

        // TODO: better desc
        // Dancing tmp dirs
        scope.tmp = null;

        scope.$watch('theme', function(theme) {
          scope.overlay = {};
          scope.artworks = [];

          scope.files = {};
          scope.config = {};

          if (!scope.theme || !scope.menu)
            return;

          var path = fs.join('Media', scope.menu, 'Themes', scope.theme+'.zip');

          scope.path = zspin.dataPath(path);
          console.log('path', scope.path);

          // stating file
          fs.stat(scope.path).then(function(stat) {
            console.log('exists', scope.path);
            return fs.mktmpdir();

          // unzipping
          }).then(function (tmp) {
            scope.tmp = tmp;
            return zip.extract(scope.path, scope.tmp.path);

          // reading extracted directory
          }).then(function () {
            return fs.readdir(scope.tmp.path);

          // sanitizing files names
          }).then(function(files) {
            var items = {};

            files.forEach(function(file) {
              var _bsd = file.toLowerCase();
              var name = _bsd.replace(/\..*?$/, '');
              items[name] = {
                name: name, file: file,
                type: _bsd.replace(/^.*\./, ''),
                path: fs.join(scope.tmp.path, file),
              };
            });

            scope.files = items;
            console.log('files', scope.files);
            var themeXml = fs.join(scope.tmp.path, 'Theme.xml');
            return xml.parse(themeXml);

          // adding files as available items
          }).then(function (config) {
            scope.config = config.Theme || {};
            var regxp = new RegExp('([a-z]*)([0-9]*)');
            var items = Object.keys(scope.config);

            items.forEach(function(item) {
              var match = item.match(regxp);
              console.log('+', match[1]);

              if (match && match[1] === 'artwork')
                scope.artworks.push({name: item, config: scope.config[item]});

              if (match && match[1] === 'video')
                scope.video = scope.config.video;
            });

            console.log('theme config', scope.config);
            console.log('theme artworks', scope.artworks);
            console.log('theme video', scope.video);
          });
        });
        // end of lambda theme watch function

      }
    };
  }
]);
