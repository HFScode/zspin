'use strict';

app.factory('menus', ['$q', 'fs', 'zspin', 'ini', 'xml',
  function($q, fs, zspin, ini, xml) {
    console.log('menus - init');

    var service = function (name) {
      var obj = {
        name: name,
      };

      // Load database entries from $HS_PATH/Databases/$NAME/$NAME.xml
      var databasePath = zspin.path('Databases', name, name+'.xml');
      fs.access(databasePath, fs.F_OK).then(function() {
        return xml.parse(databasePath);
      }).then(function(data) {
        obj.databases = data;
      });

      // Load database entries from $HS_PATH/Settings/$NAME.ini
      var settingsPath = zspin.path('Settings', name+'.ini');
      fs.access(settingsPath, fs.F_OK).then(function() {
        return ini.parse(settingsPath);
      }).then(function(data) {
        obj.settings = data;
      });

      obj.getMedias = function (basePath, glob) {
        // Load media entries from $HS_PATH/Media/$NAME/$BASEPATH/$PATTERN
        var path = zspin.path('Media', name, basePath);
        return fs.glob(glob, {cwd: path}).then(function(files) {
          var obj = {};
          files.forEach(function(file) {
            var basename = fs.basename(file);
            obj[basename] = fs.join(path, file);
          });
          return obj;
        });
      };

      return obj;
    };

    /***************************** default video ******************************/

    // // Look for the golbal default at %HS_PATH%/Media/Frontend/Video/No Video.(flv|mp4)
    // service.defaultVideo = undefined;
    // var path = zspin.path('Media', 'Frontend', 'Video');
    // fs.glob('No Video*', {cwd: path}).then(function(files) {
    //   if (files && files.length)
    //     service.defaultVideo = fs.join(path, files[0]);
    // });

    console.log('menus - ready');
    return service;
  }
]);

