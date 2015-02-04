'use strict';

app.config(['$routeProvider',
  function($routeProvider) {

    $routeProvider.when('/menus/:path*', {
      controller: 'MenuCtrl',
      templateUrl: 'Menu/template.html',
    }).when('/debug/gamepads', {
      controller: 'DebugGamepadsCtrl',
      templateUrl: 'Debug/Gamepads/template.html',
    }).otherwise({
      redirectTo: '/menus/Main Menu',
    });
  }
]);