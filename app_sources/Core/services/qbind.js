'use strict';

app.factory('qbind', ['$q',
  function ($q) {
    console.log('fs - init');

    var service = {

      // Resolve a promise with the result of a function
      // that takes a callback(error, res1, res2, ...) as last argument.
      resolve: function(d, self, func, args) {
        args = [self].concat([].slice.call(args, 0));
        func = func.bind.apply(func, args);

        func(function resolver(err) {
          if (err) {
            d.reject(err);
          } else {
            d.resolve([].slice.call(arguments, 1));
          }
        });
      },

      // Tranform a function that takes a callback(err, res1, res2, ...)
      // as last argument into a promise by fn.apply styles (args as array)
      apply: function(self, func, args) {
        var defer = $q.defer();
        service.resolve(defer, self, func, args);
        return defer.promise;
      },

      // Tranform a function that takes a callback(err, res1, res2, ...)
      // as last argument into a promise fn.call style (args as varargs)
      call: function(self, func) {
        var args = [].slice.call(arguments, 2);
        return service.apply(self, func, args);
      },




      // Resolve a promise with the result of a function
      // that takes a callback(res1, res2, ...) as last argument.
      resolveSafe: function(d, self, func, args) {
        args = [self].concat([].slice.call(args, 0));
        func = func.bind.apply(func, args);

        func(function resolver() {
          d.resolve([].slice.call(arguments, 0));
        });
      },

      // Tranform a function that takes a callback(res1, res2, ...)
      // as last argument into a promise by fn.apply styles (args as array)
      applySafe: function(self, func, args) {
        var defer = $q.defer();
        service.resolveSafe(defer, self, func, args);
        return defer.promise;
      },

      // Tranform a function that takes a callback(res1, res2, ...)
      // as last argument into a promise fn.call style (args as varargs)
      callSafe: function(self, func) {
        var args = [].slice.call(arguments, 2);
        return service.applySafe(self, func, args);
      },

    };
    console.log('qind - ready');
    return service;
  }

]);
