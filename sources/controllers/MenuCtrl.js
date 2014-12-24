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
      var path = 'Media/Main Menu/Themes/'+$scope.curItem+'.zip';
      $scope.medias = undefined;
      $scope.background = undefined;
      $scope.ready = false;
      console.log('path', path);
      $scope.medias = zip(path);
      console.log('mkdir1');
      var bg;
      fs.mktmpfile({prefix: 'prefix-', postfix: '.swf'}).then(function(args) {
        bg = 'file://'+args[0];
        return fs.writeFile(args[0], $scope.medias.readFile('Background.swf'));
        //   )
        // var file = args[1];
        // var fd = args[2];
        // console.log('mkdir2', args);
      }).then(function () {
        $scope.background = bg;
        setTimeout(function() {
          $scope.$apply(function () {
            $scope.ready = true;
            console.log('done !', bg);
          });
        }, 500);
      });
      // var data = $scope.medias.readFile('Artwork4.swf').toString('base64');
      // $scope.background = 'data:application/x-shockwave-flash;base64,'+data;

    };

    $scope.root = zspin.dataPath;
    $scope.openRoot = function() {
      zspin.gui.Shell.showItemInFolder(zspin.settingsPath);
    };

    $scope.root = zspin.dataPath;

    ini.parse('Settings/Main Menu.ini').then(function(data) {
      $scope.settings = data;
    });
    xml.parse('Databases/Main Menu/Main Menu.xml').then(function(data) {
      $scope.databases = data;
      $scope.games = data.menu.game;
      $scope.updateMedias();
    });
  }
]);