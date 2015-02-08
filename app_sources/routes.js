'use strict';

app.config(['$routeProvider',
  function($routeProvider) {

    // splashscreen
    $routeProvider.when('/start', {
      controller: 'StartCtrl',
      templateUrl: 'Start/template.html',
    });

    // menu for navigation through wheels
    $routeProvider.when('/menus/:path*', {
      controller: 'MenuCtrl',
      templateUrl: 'Menu/template.html',
    });

    // gamepad debug
    $routeProvider.when('/debug/gamepads', {
      controller: 'DebugGamepadsCtrl',
      templateUrl: 'Debug/Gamepads/template.html',
    });

    // main option menu
    $routeProvider.when('/options', {
      controller: 'OptionsCtrl',
      templateUrl: 'Options/template.html',
    });

    // error page
    $routeProvider.when('/error', {
      controller: 'ErrorCtrl',
      templateUrl: 'Error/template.html',
    });

    // default route
    $routeProvider.otherwise({
      redirectTo: '/error',
    });
  }
]);