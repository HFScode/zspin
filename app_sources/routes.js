'use strict';

app.config(['$routeProvider',
  function($routeProvider) {

    // home
    $routeProvider.when('/', {
      controller: 'BootCtrl',
      templateUrl: 'Boot/template.html',
    });

    // splashscreen
    $routeProvider.when('/intro', {
      controller: 'IntroCtrl',
      templateUrl: 'Intro/template.html',
    });

    // menu for navigation through wheels
    $routeProvider.when('/menus/:path*', {
      controller: 'MenuCtrl',
      templateUrl: 'Menu/template.html',
    });

    // debug index
    $routeProvider.when('/debug', {
      templateUrl: 'Debug/template.html',
    });

    // menus debug
    $routeProvider.when('/debug/menus', {
      controller: 'DebugMenusCtrl',
      templateUrl: 'Debug/Menus/template.html',
    });

    // gamepad debug
    $routeProvider.when('/debug/gamepads', {
      controller: 'DebugGamepadsCtrl',
      templateUrl: 'Debug/Gamepads/template.html',
    });

    // main option menu
    $routeProvider.when('/options', {
      controller: 'SettingsCtrl',
      templateUrl: 'Settings/stemplate.html',
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