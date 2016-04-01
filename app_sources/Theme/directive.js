'use strict'

app.directive('theme', ['$q', 'settings', 'fs', 'zip', 'themes', 'dataServer',
  function($q, settings, fs, zip, themes, dataServer) {

    return {
      restrict: 'E',
      templateUrl: 'Theme/template.html',
      scope: {
        src: '@',
        name: '@',
        menu: '@',
        isDefault: '@',
      },
      link: function(scope, el, attrs) {
        scope.dataServerUrl = dataServer.url;
        scope.tmpRoot = settings.hsPath(settings.$obj.cachePath, 'Theme');

        function updateTheme(src) {
          if (!src) return;
          var themeName = fs.basename(src);

          // Create new tmpPath, extract & load
          scope.tmpPath = fs.join(scope.tmpRoot, themeName);
          fs.mkdir(scope.tmpPath).then(function() {
            return zip.extract(src, scope.tmpPath);
          }).then(function() {
            scope.theme = themes(scope.tmpPath, scope.menu, themeName);
          });
        }

        function updateDefaultTheme(name) {
          if (!name) return;
          var themeName = fs.basename(scope.src);

          scope.tmpPath = fs.join(scope.tmpRoot, themeName);
          scope.theme = themes(scope.tmpPath, scope.menu, themeName, name);
        }

        // if this is a default theme, extract default theme then update by watching name
        if (scope.isDefault === 'true') {
          var themeName = fs.basename(scope.src);

          // remove then create tmpPath, extract default theme & load
          // by doing this here, we only extract Default.zip one time
          scope.tmpPath = fs.join(scope.tmpRoot, themeName);
          fs.rmrf(scope.tmpPath).then(function() {
            fs.mkdir(scope.tmpPath).then(function() {
              return zip.extract(scope.src, scope.tmpPath);
            }).then(function() {
              scope.$watch('name', function(name) {updateDefaultTheme(name);});
            });
          });

        // else normal theme
        } else {
          // Update scope.theme when src attribute change
          scope.$watch('src', function(src) {updateTheme(src);});
        }
      }
    };
  }
]);

app.directive('appendThemeScript', ['$q', 'fs', 'zspin',
  function($q, fs, zspin) {

    return {
      restrict: 'A',
      scope: {
        src: '@',
        name: '@',
      },
      link: function(scope, el, attrs) {
        var webview = el[0];

        webview.addEventListener('console-message', function(e) {
          if (e.message == 'LOADING FINISHED') {
            angular.element(webview).css('left', 0);
          } else {
            console.log('themeframe log:', e.message);
          }
        });

        // dom-ready ?
        webview.addEventListener('did-start-loading', function(e) {
          webview.executeJavaScript(global.dataServer.themeFrameData);

          // open devtools
          if (zspin.options['debug-webview']) {
            webview.openDevTools();
          }

          // mute audio
          if (zspin.options.mute) {
            webview.setAudioMuted(true);
          }
        });
      }
    };
  }
]);