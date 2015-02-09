'use strict';

app.factory('menus', ['$q', 'fs', 'zspin', 'ini', 'xml',
  function($q, fs, zspin, ini, xml) {
    console.log('menus - init');

    var Menu = function Menu(name) {
      this.name = name;
    };

    Menu.prototype.mediaPath = function() {
      var args = ['Media', this.name]
      args = args.concat([].slice.call(arguments, 0));
      return zspin.path.apply(zspin, args);
    }


    Menu.prototype.settings = function() {
      var filename = this.name+'.ini';
      var filepath = zspin.path('Settings', filename);

      return fs.exists(filepath).then(function() {
        return ini.parse(filepath)
      });
    }

    Menu.prototype.databases = function() {
      var filename = this.name+'.xml';
      var filepath = zspin.path('Databases', this.name, filename);

      return fs.exists(filepath).then(function() {
        return xml.parse(filepath)
      });
    };

    var service = function (name) {
      return new Menu(name || 'Main Menu');
    }

    console.log('menus - ready');
    return service;
  }
]);

