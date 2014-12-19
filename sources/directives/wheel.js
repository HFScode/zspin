'use strict'

app.directive('wheel', [
  function() {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'wheel.html',
      scope: {
        options: '=',
        index: '='
      },
      link: function(scope, el, attr) {
        var wheel = {};
        var options = scope.options;
        scope.index = scope.index || 0;

        function initWheel() {
          wheel = $(el).CircularCarousel(options);
          wheel.on('itemActive', function(e, item) {
            scope.index = $(item).index();
          });
        }
        function itemCount() {
          return $('.item', el).length;
        }
        scope.$watch(itemCount, initWheel);
        scope.$watch('index', function(newval, oldval) {
          if (!wheel) return;
          var count = itemCount();
          if (newval < 0)
            scope.index = count + newval;
          else if (newval > count)
            scope.index = newval % count;
          else
            wheel.cycleActiveTo(newval);
        });
      }
    };
  }
]);