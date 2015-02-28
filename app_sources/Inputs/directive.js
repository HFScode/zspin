'use strict';

app.directive('inputs', ['inputs', function (inputs) {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      var binder = inputs.bindTo(scope);
      var inputs = scope.$eval(attrs.inputs);

      angular.forEach(inputs, function (func, input) {
        binder.add({
          combo     : input,
          callback  : func,
        });
      });
    }
  };
}]);