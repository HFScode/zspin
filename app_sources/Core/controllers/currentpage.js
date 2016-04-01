'use strict';

app.controller('CurrentPage', ['$scope', '$location',
  function($scope, $location) {
    $scope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc) {
      $scope.currentPath = window.location.hash.replace(/[^a-z]/ig, '');
    });
  }
]);
