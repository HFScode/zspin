'use strict';

app.controller('MenuCtrl', ['$scope', '$document', 'zspin', 'fs', 'ini', 'xml', 'zip',
  function($scope, $document, zspin, fs, ini, xml, zip) {
    /************* This... is crack. ************/

    $scope.wheelItems = [];
    $scope.wheelPoints = [
      /* X, Y, Angle, Scale, z-index */
      [100, 100, 50, 1, 1],
      [150, 100, 20, 1, 2],
      [200, 100, 10, 1, 3],
      [350, 100, 0, 1.7, 10],
      [500, 100, -10, 1, 3],
      [550, 100, -20, 1, 2],
      [600, 100, -50, 1, 1]
    ];

    $scope.wheelOptions = {
      transitionTime: 100, // in ms
      selectPosition: 3, // index of item which serves as cursor
    };
    
    $document.bind('keydown', function(e) {
      if (!$scope.wheelControl) return;
      if (e.which == 37) //left
        $scope.wheelControl.prev();
      if (e.which == 39) //right
        $scope.wheelControl.next();
      $scope.updateMedias();
      e.preventDefault();
    });   

    /********************************************/

    $scope.updateMedias = function() {
      // Setup new vars
      $scope.bg = {};
      $scope.medias = undefined;
      $scope.curItem = undefined;

      if (!$scope.wheelControl) { return; }
      $scope.curItem =  $scope.wheelControl.select();

      if (!$scope.curItem) { return; }
      var path = $scope.curItem.media;

      fs.stat(path).then(function(stat) {
        console.log('Media File Exists');
        var medias = zip(path);
        $scope.medias = medias;
        return medias.readFile('Background.swf');
      }).then(function(data) {
        console.log('Got .swf file datas', (data || {length: 'shit'}).length);
        $scope.bg.data = data;
        return fs.mktmpfile({ postfix: '.swf'});
      }).then(function(tmp) {
        console.log('Got tmp File', tmp.path);
        $scope.bg.path = tmp.path;
        return fs.writeFile($scope.bg.path, $scope.bg.data);
      }).then(function() {
        console.log('File should be written !');
        $scope.bg.url = 'file://'+$scope.bg.path;
      });
    };

    $scope.root = zspin.dataPath();
    $scope.openRoot = function() {
      zspin.gui.Shell.openItem($scope.root);
    };
    var settingsFile = zspin.dataPath('Settings/Main Menu.ini');
    ini.parse(settingsFile).then(function(data) {
      $scope.settings = data;
    });
    var databaseFile = zspin.dataPath('Databases/Main Menu/Main Menu.xml');
    xml.parse(databaseFile).then(function(data) {
      $scope.databases = data;
      $scope.wheelItems = data.menu.game.map(function(item) {
        var zipPath = zspin.dataPath('Media/Main Menu/Themes/'+item.name+'.zip');
        var imgPath = zspin.dataPath('Media/Main Menu/Images/Wheel/'+item.name+'.png');
        return {name: item.name, file: imgPath, media: zipPath};
      });
      $scope.updateMedias();
    });
  }
]);