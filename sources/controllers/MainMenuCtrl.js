'use strict';

var app = angular.module('app');
var gui = require('nw.gui');

app.controller('MainMenuCtrl', ['$scope', '$location', 'settings',
  function($scope, $location, settings) {
    $scope.bite = "cul";
    $scope.root = settings.root;
    $scope.openRoot = function() {
      gui.Shell.showItemInFolder(settings.root);
    }
    $scope.data = '';
    $scope.parse = function() {
      $scope.data = settings.parse('Main Menu');
    };

  }
]);