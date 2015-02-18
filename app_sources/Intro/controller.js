'use strict';

app.controller('IntroCtrl', ['$scope', 'fs', 'zspin',
  function($scope, fs, zspin) {

    function basename(filename) {
      return filename.toLowerCase().replace(/\..*?$/, '');
    }
    function tmp_path () {
      return fs.join.bind(fs, $scope.path).apply(fs, arguments);
    }

    $scope.path = zspin.path('Media', 'Frontend', 'Video');
    fs.readdir($scope.path).then(function(files) {
      var videos = files.filter(function(file) {
        return basename(file) === 'intro';
      }).map(function(file) {
        return tmp_path(file);
      });
      if (videos.length !== 0)
        $scope.video = videos[0];
    });

    $scope.player = {};
  }
]);
