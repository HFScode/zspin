'use strict'

app.directive('wheel', ['resize',
  function(resize) {

    return {
      restrict: 'E',
      transclude: true,
      scope: {
        items: '=',
        options: '=',
        control: '=',
      },
      link: function(scope, el, attr) {
        scope.wheel = undefined;

        scope.$on('resize', function($event) {
          if (!scope.wheel)
            return;
          scope.wheel.update();
        });

        function updateWheel() {
          if (!scope.items || !scope.items.length || !scope.options)
            return;

          // Generate random id
          var uid = 'wheel-'+(''+Math.random()).split('.')[1];

          // Copy items
          var items = angular.copy(scope.items||[]);
          var points = angular.copy(scope.options.points||[]);
          var options = angular.extend({}, scope.options, {
            containerId: uid,
          });

          // Reset DOM/Wheel
          $(el).html('<div id="'+uid+'">');
          scope.wheel = new jswheel(items, points, options);
          scope.control = scope.wheel;
        }

        // Either matter
        scope.$watch('items', updateWheel);
        scope.$watch('points', updateWheel);
        scope.$watch('options', updateWheel);
      }
    };
  }
]);