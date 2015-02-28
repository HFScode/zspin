'use strict';

app.directive('nwkeyboard', ['NWKeyboard', function (NWKeyboard) {
  return {
    restrict: 'A',
    scope: {nwkeyboard: '='},
    link: function (scope, el, attrs) {
      var binder = NWKeyboard.bindTo(scope);

      scope.$watch('nwkeyboard', function(binds, oldbinds) {
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