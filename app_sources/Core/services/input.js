'use strict';

app.factory('inputs', ['$rootScope', 'hotkeys', '$gamepad',
  function ($rootScope, hotkeys, gamepad) {
    console.log('inputs - init');

    //  -  Services for ini-file parsing  -
    var service = {};
    $rootScope.$on('gamepad:updated', function(gamepad) {
      console.log('gamepad:updated', gamepad);
    });
    // console.log(gamepad.rootScope);
    console.log('inputs - ready');
    return service;
  }
]);
