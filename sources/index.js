'use strict';

var app = angular.module('app', [
  'ngRoute',
  'templates',
]);


// Wraps a promise around a function call that
// expects a function(error, result) callback.
function wrapCallback(d, func, that, args) {
  args.push(function (err, res) {
    if (err)
      d.reject(err);
    else
      d.resolve(res);
  });
  func.apply(that, args);
  return d.promise;
}

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

