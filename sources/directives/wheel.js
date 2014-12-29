'use strict'

app.directive('wheel', [
  function() {

    return {
      restrict: 'E',
      transclude: true,
      // templateUrl: 'wheel.html',
      scope: {
        items: '=',
        points: '=',
        options: '=',
        control: '=',
      },
      link: function(scope, el, attr) {
        scope.wheel = undefined;

        function initWheel() {
          if (!scope.items.length || scope.points.length < 2)
            return;

          // generate random id
          var uid = 'wheel-'+(''+Math.random()).split('.')[1];
          var items = angular.copy(scope.items||[]);
          var points = angular.copy(scope.points||[]);
          var options = angular.extend({}, scope.options, {
            container: '#'+uid
          });

          // Reset DOM/Wheel
          $(el).html('<div id="'+uid+'">');
          scope.wheel = $.wheelspinner(items, points, options);
          scope.control = scope.wheel;
        }

        // Either matter
        scope.$watch('items', initWheel);
        scope.$watch('points', initWheel);

        scope.$watch('index', function(newval, oldval) {
          if (scope.wheel && newval !== oldval)  {
            var dir = (newval < oldval) ? 'prev' : 'next';
            scope.wheel.move(dir);
          }
        });

      }
    };
  }
]);