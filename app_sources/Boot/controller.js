'use strict';

app.controller('BootCtrl', ['$scope', 'settings', '$location', 'zspin', 'statistics',
  function($scope, settings, $location, zspin) {
    if (settings.$obj.firstRun) {
        $location.path('/settings');
    } else {
        $location.path('/intro');
    }

    // this is used in osx to ensure that the fullscreened window is inputtable with keys
    zspin.focus();
  }
]);
