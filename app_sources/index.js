'use strict';

var app = angular.module('app', [
  'ngLoad',
  'ngRoute',
  'ngResize',
  // 'ngRaven',
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

// =========== Raven-js (sentry) config
// app.value("RavenConfig", {
//   dsn: 'http://a0838271e36b48b5883a9d2b6909e3a5@sentry.vik.io/2',
//   config: {
//     dataCallback: function(data) {
//       // remove everything except filename
//       data.culprit = data.culprit.split('/').pop();
//       data.request.url = data.request.url.split('index.html#')[1];
//       for (var i in data.stacktrace.frames) {
//         data.stacktrace.frames[i].filename =
//           data.stacktrace.frames[i].filename.split('/').pop();
//       }
//       return data;
//     }
//   }
// });

// =========== Preload services and language
app.run(['$translate', 'settings', 'inputs', function($translate, settings, inputs) {
  // Force the settings service to be instanciated early
  // Apply language
  $translate.use(settings.$obj.language);
}]);

// =========== zspin core settings
app.run(['zspin', function(zspin) {

  // set Raven infos
  // Raven.setReleaseContext(zspin.gui.App.manifest.version);
  // Raven.setTagsContext({'nw.js': process.versions['node-webkit']});
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
