'use strict';

var app = angular.module('app');

app.controller('MainMenuCtrl', ['$scope', '$location',
  function($scope, $location) {
    $scope.bite = "cul";
  }
]);