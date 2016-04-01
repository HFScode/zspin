'use strict';

app.controller('CurrentPage', ['$scope', '$location',
  function($scope, $location) {
    $scope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc) {
      $scope.currentPath = window.location.hash.replace(/\//g, ' ').replace(/[^a-z ]/ig, '');
    });
  }
]);
