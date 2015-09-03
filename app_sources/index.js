'use strict';

var app = angular.module('app', [
  'ngLoad',
  'ngRoute',
  'ngResize',
  'cfp.hotkeys',
  'jsonFormatter',
  'templates',
  'toastr',
  'ngAnimate',
  'pascalprecht.translate',
  'piwik',
]);

// =========== resize provider
app.config(['resizeProvider', function(resizeProvider){
  resizeProvider.throttle = 10;
  resizeProvider.initBind = true;
}]);

// =========== url whitelist
app.config(['$sceDelegateProvider', function($sceDelegateProvider){
  $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^.*$')]);
}]);

// =========== toastr notifications config
app.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    extendedTimeOut: 1000,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    tapToDismiss: true,
    timeOut: 1000,
  });
});

// =========== translate provider
app.config(['$translateProvider', function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'lang/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en_US');
  $translateProvider.fallbackLanguage('en_US');
}]);

// =========== Preload services and language
app.run(['$translate', 'settings', 'inputs', function($translate, settings, inputs) {
  // Force the settings service to be instanciated early
  // Apply language
  $translate.use(settings.$obj.language);
}]);

// =========== config shortcuts
app.run(['$rootScope', 'zspin', '$location', function($rootScope, zspin, $location) {

  // Create global home shortcut
  $rootScope.$on('input:home', function () {
    zspin.focus(); //use when quitting game
  });

  // Create settings shortcut
  $rootScope.$on('input:settings', function () {
    $location.url('/settings');
  });

  // Create fullscreen shortcut
  $rootScope.$on('input:fullscreen', function () {
    zspin.toggleFullscreen();
  });

  // Create devtools shortcut
  $rootScope.$on('input:devtools', function () {
    zspin.guiWindow.toggleDevTools();
  });

  // Create devmenu shortcut
  $rootScope.$on('input:devmenu', function () {
    $location.url('/debug');
  });

}]);
