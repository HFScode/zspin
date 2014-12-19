'use strict'

app.directive('wheel', ['$document', '$timeout',
  function($document, $timeout) {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'wheel.html',
      scope: {
        options: '='
      },
      link: function(scope, el, attr) {
        var options = scope.options;
        $timeout(function() {
          var wheel = $(el).CircularCarousel(options);
          $document.bind('keydown', function(e) {
            if (e.which == 37) //left
              wheel.cycleActive('previous');
            if (e.which == 39) //right
              wheel.cycleActive('next');
          });
        }, 1000);
      },
    };
  }
]);