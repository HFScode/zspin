'use strict';

var app = angular.module('app', [
  'ngRoute',
  'templates',
]);


// Wraps a promise around a function call that
// expects a function(error, result) callback.
function wrapCallback(d, func) {
  func(function resolver(err) {
    if (err) {
      d.reject(err);
    } else {
      var res = [];
      res = res.slice.call(arguments, 1);
      res = (res.length > 1) ? res : res[0];
      console.log('_', res);
      d.resolve(res);
    }
  });
}

app.config( ['$sceDelegateProvider', function($sceDelegateProvider){   
  $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^.*$')]);
}]);

app.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider.when('/', {
      controller: 'MenuCtrl',
      templateUrl: 'Menu.html',
    }).otherwise({ 
      redirectTo: '/',
    });
  }
]);

