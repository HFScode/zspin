'use strict';

app.directive('domkeyboard', ['DOMKeyboard', function (DOMKeyboard) {
  return {
    restrict: 'A',
    scope: {domkeyboard: '='},
    link: function (scope, el, attrs) {
      var binder = DOMKeyboard.bindTo(scope);

      scope.$watch('domkeyboard', function(binds, oldbinds) {
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