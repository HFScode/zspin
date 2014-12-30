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
      controller: function($scope) {
        $scope.path = function(file) {
          return fs.join(($scope.tmp || ''), file);
        };
        $scope.ext = function(str) {
          return str.replace(/^.*\./, '').toLowerCase();
        };
        $scope.name = function(str) {
          return str.replace(/\..*?$/, '').toLowerCase();
        };
        $scope.css = function(name) {
          console.log('ah', name);
          var key, val;
          var conf = $scope.config[name] || {};
          var css = {};
          console.log('ag', conf);
          if (conf.w)
            css.width = conf.w+'px';
          if (conf.h)
            css.height = conf.h+'px';
          if (conf.x)
            css.top = conf.x+'px';
          if (conf.y)
            css.left = conf.y+'px';
          return css;
        };

        $scope.$watch('theme', function(theme) {
          $scope.entries = [];
          $scope.config = {};

          if (!theme) return;
          fs.stat($scope.theme).then(function(stat) {
            return fs.mktmpdir();
          }).then(function (tmp) {
            $scope.tmp = tmp.path;
            return zip.extract($scope.theme, $scope.tmp);
          }).then(function () {
            return fs.readdir($scope.tmp);
          }).then(function (entries) {
            $scope.entries = entries;
            return xml.parse($scope.path('Theme.xml'));
          }).then(function (config) {
            $scope.config = config.Theme || {};
            $scope.ready = true;
          });
        });
      }
    };
  }
]);
