'use strict';

app.controller('piwikCtrl', ['$scope', 'zspin',
  function($scope, zspin) {
    // update piwikCtrl: update haveInternet on query result in zspin service.
    // deactivate piwik if we don't have internet
    $scope.$watch( function () { return zspin.haveInternet; }, function (data) {
      $scope.haveInternet = data;
    }, true);
  }
]);
