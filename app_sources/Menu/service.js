'use strict';

app.factory('menus', ['$q', 'fs', 'settings', 'ini', 'xml',
  function($q, fs, settings, ini, xml) {
    console.log('menus - init');

    var service = function (name) {
      var obj = {
        name: name,
      };

      // Load database entries from $HS_PATH/Databases/$NAME/$NAME.xml
      var databasePath = settings.hsPath('Databases', name, name+'.xml');
      fs.access(databasePath, fs.F_OK).then(function() {
        return xml.parse(databasePath);
      }).then(function(data) {
        obj.databases = data;
      });

      // Load database entries from $HS_PATH/Settings/$NAME.ini
      var settingsPath = settings.hsPath('Settings', name+'.ini');
      fs.access(settingsPath, fs.F_OK).then(function() {
        return ini.parse(settingsPath);
      }).then(function(data) {
        obj.settings = data;
      });

      obj.getMedias = function (basePath, glob) {
        // Load media entries from $HS_PATH/Media/$NAME/$BASEPATH/$PATTERN
        var path = settings.hsPath('Media', name, basePath);
        return fs.glob(glob, {cwd: path}).then(function(files) {
          var obj = {};
          files.forEach(function(file) {
            var basename = fs.basename(file);
            obj[basename] = fs.join(path, file);
          });
          return obj;
        });
      };

      obj.getWheel = function() {
        // Load wheel.json for this menu if found
        var path = settings.hsPath('Databases', name, 'wheel.json');

        return fs.access(path, fs.F_OK).then(function() {
          return fs.readFile(path, 'utf-8').then(function(data) {
            return JSON.parse(data);
          });
        });
      };

      return obj;
    };

    /***************************** default video ******************************/

    // // Look for the golbal default at %HS_PATH%/Media/Frontend/Video/No Video.(flv|mp4)
    // service.defaultVideo = undefined;
    // var path = settings.hsPath('Media', 'Frontend', 'Video');
    // fs.glob('No Video*', {cwd: path}).then(function(files) {
    //   if (files && files.length)
    //     service.defaultVideo = fs.join(path, files[0]);
    // });

    console.log('menus - ready');
    return service;
  }
]);

