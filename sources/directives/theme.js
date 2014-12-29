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
        scope.path = function(file) {
          return fs.join((scope.tmp || ''), file);
        };
        scope.ext = function(str) {
          return str.replace(/^.*\./, '').toLowerCase();
        };
        scope.name = function(str) {
          return str.replace(/\..*?$/, '').toLowerCase();
        };


        scope.$watch('theme', function(theme) {
          scope.entries = [];
          scope.config = {};

          if (!theme) return;
          fs.stat(scope.theme).then(function(stat) {
            return fs.mktmpdir();
          }).then(function (tmp) {
            scope.tmp = tmp.path;
            return zip.extract(scope.theme, scope.tmp);
          }).then(function () {
            return fs.readdir(scope.tmp);
          }).then(function (data) {
            scope.entries = data;
            return xml.parse(scope.path('Theme.xml'));
          }).then(function (data) {
            scope.config = data.Theme || {};
            scope.ready = true;
          });
        });
      }
    };
  }
]);
