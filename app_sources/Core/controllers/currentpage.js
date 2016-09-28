'use strict';

app.controller('rootControler', ['$scope', '$location', 'zspin',
  function($scope, $location, zspin) {
    $scope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc) {
      // generate some class names for <body> tag, based on first 2 url hashes
      var hashes = window.location.hash
        .replace(/\//g, ' ')
        .replace(/[^a-z ]/ig, '')
        .trim()
        .split(' ');
      $scope.currentPath = hashes.slice(0, 2).join(' ');
      $scope.zspinOptions = zspin.options;
    });

  }
]);
