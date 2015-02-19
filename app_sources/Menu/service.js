'use strict';

app.factory('menus', ['$q', 'fs', 'zspin', 'ini', 'xml',
  function($q, fs, zspin, ini, xml) {
    console.log('menus - init');

    var Menu = function Menu(name) {
      this.name = name;
    };

    Menu.prototype.mediaPath = function() {
      var args = ['Media', this.name];
      args = args.concat([].slice.call(arguments, 0));
      return zspin.path.apply(zspin, args);
    };


    Menu.prototype.settings = function() {
      var filename = this.name+'.ini';
      var filepath = zspin.path('Settings', filename);

      return fs.exists(filepath).then(function() {
        return ini.parse(filepath);
      });
    };

    Menu.prototype.databases = function() {
      var filename = this.name+'.xml';
      var filepath = zspin.path('Databases', this.name, filename);

      return fs.exists(filepath).then(function() {
        return xml.parse(filepath);
      });
    };

    Menu.prototype.videos = function() {
      var videoPath = this.mediaPath('Video');
      return fs.readdir(videoPath).then(function(files) {
        var videos = {};
        files.filter(function(file) {
          return fs.extname(file) === 'flv';
        }).forEach(function(file) {
          videos[fs.basename(file)] = fs.join(videoPath, file);
        });
        return videos;
      });
    };

    var service = function (name) {
      return new Menu(name || 'Main Menu');
    };

    var defaultVideoPath = zspin.path('Media', 'Frontend', 'Video');
    fs.readdir(defaultVideoPath).then(function(files) {
      var videos = files.filter(function(file) {
        return fs.basename(file) === 'No Video';
      }).map(function(file) {
        return fs.join(defaultVideoPath, file);
      });
      service.defaultVideo = videos[0];
    });

    console.log('menus - ready');
    return service;
  }
]);

