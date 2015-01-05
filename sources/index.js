'use strict';

var app = angular.module('app', [
  'ngLoad',
  'ngRoute',
  'templates',
]);

// Wraps a promise around a function call that
// expects a function(error, result) callback.
function wrapErrCallback(d, self, func, args) {
  // var err = new Error();
  // var callee = err.stack.split(' at ')[2];
  // console.log('wrap', callee, [].slice.call(args, 0));
  args = [self].concat([].slice.call(args, 0));
  func = func.bind.apply(func, args);
  func(function resolver(err) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve([].slice.call(arguments, 1));
    }
  });
}
function wrapCallback(d, self, func, args) {
  args = [self].concat([].slice.call(args, 0));
  func = func.bind.apply(func, args);
  func(function resolver() {
    d.resolve([].slice.call(arguments, 0));
  });
}

app.config( ['$sceDelegateProvider', function($sceDelegateProvider){   
  $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^.*$')]);
}]);

app.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider.when('/menus/:menu', {
      controller: 'MenuCtrl',
      templateUrl: 'Menu.html',
    }).otherwise({ 
      redirectTo: '/menus/Main Menu',
    });
  }
]);

