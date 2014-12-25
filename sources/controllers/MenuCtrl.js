'use strict';

app.controller('MenuCtrl', ['$scope', '$document', 'zspin', 'fs', 'ini', 'xml', 'zip',
  function($scope, $document, zspin, fs, ini, xml, zip) {
    /************* This... is crack. ************/
    $scope.wheeloptions =  {
      ovalWidth: 400,
      ovalHeight: 50,
      offsetX: 100,
      offsetY: 325,
      angle: 0,
      activeItem: 0,
      duration: 350,
      className: 'item'
    };

    $document.bind('keydown', function(e) {
      if (e.which == 37) //left
        $scope.$apply(function() {$scope.wheelindex-- });
      if (e.which == 39) {//right
        $scope.$apply(function() {$scope.wheelindex++ });
      }
      e.preventDefault();
    });   
    $scope.index = 0;
    /********************************************/

    $scope.$watch('wheelindex', function(idx) {
      if (!$scope.games) return;
      $scope.updateMedias();
    });

    // $scope.medias;
    $scope.updateMedias = function() {
      var index = $scope.wheelindex;
      $scope.curItem = $scope.games[index].name;
      // Reinit items on change
      $scope.ready = false;
      $scope.medias = undefined;
      $scope.background = undefined;

      // Setup new vars
      var file = 'Media/Main Menu/Themes/'+$scope.curItem+'.zip';
      var path = zspin.dataPath(file);

      console.log('path', path);
      fs.stat(path).then(function(res) {
        $scope.medias = zip(path);
        console.log('yepee');
        return fs.mktmpfile({postfix: '.swf'});
      }).then(function(tmp) {
        console.log('yepee2');
        $scope.background = 'file://'+tmp.path;
        var data = $scope.medias.readFile('Background.swf');
        return fs.writeFile(tmp.path, data);
      }).then(function() {
        console.log('done !', $scope.background);
        $scope.ready = true;
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
      $scope.games = data.menu.game;
      $scope.updateMedias();
    });
  }
]);