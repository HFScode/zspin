'use strict';

var app = angular.module('app', [
  'ngRoute',
  'templates',
]);


app.config(['$locationProvider', 
  function($locationProvider) {
    $locationProvider.html5Mode(true);
  }
]);

app.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider.when('/', {
      controller: 'MainMenuCtrl',
      templateUrl: 'MainMenu.html',
    }).otherwise({ 
      redirectTo: '/',
    });
  }
]);

