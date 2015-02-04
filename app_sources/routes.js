'use strict';

app.config(['$routeProvider',
  function($routeProvider) {

    $routeProvider.when('/menus/:path*', {
      controller: 'MenuCtrl',
      templateUrl: 'Menu/template.html',
    }).otherwise({
      redirectTo: '/menus/Main Menu',
    });
  }
]);