'use strict';

app.directive('gamepad', ['gamepads', function (gamepads) {
  return {
    restrict: 'A',
    scope: {gamepad: '='},
    link: function (scope, el, attrs) {
      var binder = gamepads.bindTo(scope);

      scope.$watch('gamepad', function(binds, oldbinds) {
        for (var oldcombo in oldbinds)
          binder.del(oldcombo);
        for (var combo in binds)
          binder.add({
            combo     : combo,
            callback  : binds[combo],
            action    : attrs.keyboardaction,
          });
      });

    }
  };
}]);