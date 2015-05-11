'use strict';

app.factory('themes', ['$q', 'fs', 'settings', 'zip', 'xml',
  function($q, fs, settings, zip, xml) {
    console.log('themes - init');

    function registerFiles(path, files, dst) {
      var obj = dst || {};
      files.forEach(function(file) {
        var basename = fs.basename(file);
        obj[basename] = fs.join(path, file);
      });
      return obj;
    }

    var service = function (path, menu, name) {
      var obj = {
        menu: menu,
        path: path,
        name: name,
        manifest: {},
        artworks: {},
        background: null,
      };

      var ownFiles = {};
      // Glob to list theme files
      fs.glob('*', {cwd: obj.path}).then(function(files) {
        registerFiles(obj.path, files, ownFiles);
        // Parse Theme.xml manifest
        return xml.parse(ownFiles.Theme);
      }).then(function(data) {
        obj.manifest = data.Theme;

        // Find artworks file paths
        if (obj.manifest.artwork1 && ownFiles.Artwork1)
          obj.artworks.artwork1 = ownFiles.Artwork1;
        if (obj.manifest.artwork2 && ownFiles.Artwork2)
          obj.artworks.artwork2 = ownFiles.Artwork2;
        if (obj.manifest.artwork3 && ownFiles.Artwork3)
          obj.artworks.artwork3 = ownFiles.Artwork3;
        if (obj.manifest.artwork4 && ownFiles.Artwork4)
          obj.artworks.artwork4 = ownFiles.Artwork4;

        // Find background file path
        if (ownFiles.Background)
          obj.background = ownFiles.Background;

        // Find overlay file path
        if (obj.manifest.video && ownFiles.Video) {
          obj.overlay = ownFiles.Video;
          obj.video = service.defaultVideo;
        }

        // Look for video in $HSROOT/Media/$MENU/Video/$NAME.*
        if (obj.manifest.video) {
          var path = settings.hsPath('Media', obj.menu, 'Video');
          fs.glob(obj.name+'.*', {cwd: path}).then(function(files) {
            if (files && files.length !== 0)
              obj.video = fs.join(path, files[0]);
          });
        }
      });

      return obj;
    };

    /***************************** default video ******************************/

    // Look for the golbal default at %HS_PATH%/Media/Frontend/Video/No Video.(flv|mp4)
    service.defaultVideo = '';
    var path = settings.hsPath('Media', 'Frontend', 'Video');
    fs.glob('No Video*', {cwd: path}).then(function(files) {
      if (files && files.length !== 0)
        service.defaultVideo = fs.join(path, files[0]);
    });

    console.log('themes - ready');
    return service;
  }
]);

