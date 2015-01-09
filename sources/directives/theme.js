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
          fs.stat(scope.path).then(function(stat) {
            console.log('exists', scope.path);
            return fs.mktmpdir();
          }).then(function (tmp) {
            scope.tmp = tmp;
            return zip.extract(scope.path, scope.tmp.path);
          }).then(function () {
            return fs.readdir(scope.tmp.path);
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

      }
    };
  }
]);


app.directive('themeartwork', [
  function() {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'themeArtwork.html',
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
