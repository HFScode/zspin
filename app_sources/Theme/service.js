'use strict';

app.factory('themes', ['$q', 'fs', 'settings', 'zip', 'xml', 'fileServer',
  function($q, fs, settings, zip, xml, fileServer) {
    console.log('themes - init');
    var $fs = require('fs');

    var service = {};

    function registerFiles(path, files, dst) {
      var obj = dst || {};
      files.forEach(function(file) {
        var basename = fs.basename(file);
        obj[basename] = fs.join(path, file);
      });
      return obj;
    }

    service.curType = null;

    service = function (path, menu, name, nameDefault) {
      var obj = {
        menu: menu,
        path: path,
        name: name,
        manifest: {},
        artworks: {},
        background: null,
        html: false,
        video: null,
      };

      // Check if this is a Html theme
      var htmlPath = fs.join(path, 'index.html');
      if ($fs.existsSync(htmlPath, $fs.F_OK)) {
        fileServer.initServe();
        fileServer.serveFolder = path;

        // Default theme handling
        if (nameDefault !== undefined) {
          var mediaPath = settings.hsPath('Media', obj.menu, 'Images', 'Artwork');

          // for each artwork folder (1,2,3,4)
          for (var i = 1; i <= 4; i++) { (function (i) {
            fs.glob(nameDefault+'.*', {cwd: mediaPath+i}).then(function(files) {
              if (files && files.length > 0) {
                obj.artworks['artwork'+i] = fs.join(mediaPath+i, files[0]);
                fileServer.serveFile['Artwork'+i+'.'+fs.extname(files[0])] = obj.artworks['artwork'+i];
              }
            });
          })(i);}
        }

        // Look for video in $HSROOT/Media/$MENU/Video/$NAME.*
        var vidPath = settings.hsPath('Media', menu, 'Video');

        fs.glob(name+'.*', {cwd: vidPath}).then(function(files) {
          if (files && files.length !== 0) {
            obj.video = fs.join(vidPath, files[0]);
            fileServer.serveFile[files[0]] = obj.video;
          }
          obj.html = htmlPath;
        });
        service.curType = 'html';
        return obj;
      }

      // Else this is a standard HS Theme
      var ownFiles = {};
      // Glob to list theme files
      fs.glob('**/*', {cwd: obj.path}).then(function(files) {
        registerFiles(obj.path, files, ownFiles);
        // Parse Theme.xml manifest
        return xml.parse(ownFiles.Theme);
      }).then(function(data) {
        obj.manifest = data.Theme;

        // Find default theme artworks if exists
        if (nameDefault !== undefined) {
          var mediaPath = settings.hsPath('Media', obj.menu, 'Images', 'Artwork');

          // for each artwork folder (1,2,3,4)
          for (var i = 1; i <= 4; i++) { (function (i) {
            fs.glob(nameDefault+'.*', {cwd: mediaPath+i}).then(function(files) {
              if (files && files.length > 0) {
                obj.artworks['artwork'+i] = fs.join(mediaPath+i, files[0]);
              }
            });
          })(i);}
        }

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
        if (ownFiles.Background) {
          obj.background = ownFiles.Background;
        }

        // Find overlay file path
        if (obj.manifest.video && ownFiles.Video) {
          obj.overlay = ownFiles.Video;
        }

        // Look for video in $HSROOT/Media/$MENU/Video/$NAME.*
        if (obj.manifest.video) {
          var path = settings.hsPath('Media', obj.menu, 'Video');

          var videoName = obj.name;
          // if this is a default theme, change look path for video
          if (nameDefault !== undefined) {
            videoName = nameDefault;
          }

          fs.glob(videoName+'.*', {cwd: path}).then(function(files) {
            if (files && files.length > 0) {
              obj.video = fs.join(path, files[0]);
            } else {
              obj.video = service.defaultVideo;
            }
          });
        }
      });

      service.curType = 'hs';
      return obj;
    };

    /***************************** default video ******************************/

    // Look for the global default at %HS_PATH%/Media/Frontend/Video/No Video.(flv|mp4)
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

