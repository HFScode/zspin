'use strict';

app.config(['$routeProvider',
  function($routeProvider) {

    $routeProvider

    // splashscreen
    .when('/start', {
      controller: 'StartCtrl',
      templateUrl: 'Start/template.html',

    // menu for navigation through wheels
    }).when('/menus/:path*', {
      controller: 'MenuCtrl',
      templateUrl: 'Menu/template.html',

    // gamepad debug
    }).when('/debug/gamepads', {
      controller: 'DebugGamepadsCtrl',
      templateUrl: 'Debug/Gamepads/template.html',

    // main option menu
    }).when('/options', {
      controller: 'OptionsCtrl',
      templateUrl: 'Options/template.html',

    // error page
    }).when('/error', {
      controller: 'ErrorCtrl',
      templateUrl: 'Error/template.html',

    }).otherwise({
      redirectTo: '/error',
    });
  }
]);