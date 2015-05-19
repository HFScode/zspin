'use strict';

app.controller('BootCtrl', ['$scope', 'settings', '$location',
  function($scope, settings, $location) {
    if (settings.$obj.firstRun) {
        $location.path('/settings');
    } else {
        $location.path('/intro');
    }
  }
]);
