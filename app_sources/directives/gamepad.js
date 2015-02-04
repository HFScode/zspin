'use strict';

app.directive('gamepad', function (gamepads) {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      var binder = gamepads.bindTo(scope);
      var binds = scope.$eval(attrs.gamepad);

      angular.forEach(binds, function (func, gamepad) {
        console.log(attrs, attrs.gamepadarepeat);
        binder.add({
          combo     : gamepad,
          callback  : func,
          action    : attrs.gamepadaction,
          gamepad   : attrs.gamepadgamepad,
          threshold : attrs.gamepadthreshold,
          repeat    : attrs.gamepadrepeat,
        });
      });
    }
  };
});