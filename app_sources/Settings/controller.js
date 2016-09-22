'use strict';

app.controller('SettingsCtrl', ['$scope', '$translate', 'DOMKeyboard', 'gamepads', 'settings', 'inputs', 'toastr', 'zspin', 'zip', 'fs',
  function($scope, $tr, DOMKeyboard, gamepads, settings, inputs, toastr, zspin, zip, fs) {

    const dialog = require('electron').remote.dialog;
    const shell = require('electron').shell;

    var gpBinder = gamepads.bindTo($scope);
    var kbBinder = DOMKeyboard.bindTo($scope);
    // the purpose of this is to sort binds for displaying configuration fields
    $scope.sortedBinds = [
      {'name':'up',         'desc': 'Up navigation in menus'},
      {'name':'down',       'desc': 'Down navigation in menus'},
      {'name':'left',       'desc': 'Left navigation in menus'},
      {'name':'right',      'desc': 'Right navigation in menus'},
      {'name':'enter',      'desc': 'Select a menu'},
      {'name':'back',       'desc': 'Go back in a menu'},
      {'name':'home',       'desc': 'Global "show zspin" button, works when zspin is not focused'},
      {'name':'settings',   'desc': 'Go to settings menu'},
      {'name':'fullscreen', 'desc': 'Toggle fullscreen'},
      {'name':'devtools',   'desc': 'Show the developer tools window'},
    ];

    var focus = undefined;
    $scope.bindinfo = [];

    $scope.focus = function(bind, idx) {
      focus = {bind: bind, idx: idx};
    };

    $scope.blur = function() {
      $scope.bindinfo[focus.bind] = false;
      focus = undefined;
    };

    gpBinder.add({combo: '*', callback: function(input) {
      if (!focus) return;
      var binds = $scope.settings.binds;
      binds[focus.bind] = binds[focus.bind] || {};
      binds[focus.bind][focus.idx] = {source: 'gamepad', combo: input.combo};
      if (focus.bind === 'home')
        binds[focus.bind][focus.idx].global = true;
      $scope.cancelInput();
      inputs.loadSettings();
    }});

    kbBinder.add({combo: '*', callback: function(input) {
      if (!focus) return;
      var binds = $scope.settings.binds;
      binds[focus.bind] = binds[focus.bind] || {};
      binds[focus.bind][focus.idx] = {source: 'keyboard', combo: input.combo};
      if (focus.bind === 'home')
        binds[focus.bind][focus.idx].global = true;
      inputs.loadSettings();
    }});

    // Restore local settings to saved state
    $scope.reset = function() {
      angular.copy(settings.$obj, $scope.settings);
    };

    // Update global settings and persist to disk
    $scope.save = function() {
      $tr.use($scope.settings.language);
      if ($scope.settings.hsPath === '') {
        toastr.warning($tr.instant("You must configure data folder path !"));
        return;
      }
      $scope.settings.firstRun = false;

      angular.copy($scope.settings, settings.$obj);
      settings.write();
      toastr.success($tr.instant('Settings saved !'));
      inputs.loadSettings();
    };

    $scope.settings = {};
    $scope.reset();

    $scope.releaseInfo = zspin.appName+' v'+zspin.gui.getVersion();
    $scope.licenseInfo = '' + zspin.appLicense;

    $scope.chooseDirectory = function(name) {
      var folder = dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      if (folder) {
        $scope.settings[name] = folder[0];
      }
    };

    $scope.chooseFile = function(name) {
      var file = dialog.showOpenDialog({
        properties: ['openFile']
      });
      if (file) {
        $scope.settings[name] = file[0];
      }
    };

    $scope.clear = function(input) {
      $scope.settings.binds[input] = {};
      inputs.loadSettings();
    };

    $scope.setPress = function(event) {
      inputs.unloadSettings();
      $scope.bindinfo[focus.bind] = $tr.instant('<press a key>');
    };

    $scope.cancelInput = function(event) {
      if (event !== undefined) {
        event.preventDefault();
      }
      $scope.bindinfo[focus.bind] = false;
    };

    $scope.updatePath = function() {
      $scope.settings[this.name] = this.value;
      $scope.$apply();
    };

    $scope.openData = function() {
      shell.openItem(settings.dataPath());
    };

    $scope.openHS = function() {
      shell.openItem(settings.hsPath());
    };

    $scope.openBinary = function() {
      shell.openItem(settings.binaryPath());
    };

    // creates an empty directory structure for no previous install
    $scope.populateDataFolder = function() {
      if ($scope.settings.hsPath === '') {
        toastr.error($tr.instant("Please provide a data folder before populating."), {timeOut: 3000});
        return;
      }

      zip.extract(fs.join(__dirname, 'assets', 'blank_datafolder.zip'), $scope.settings.hsPath).then(function() {
        toastr.success($tr.instant("Folder structure has been created."), {timeOut: 3000});
      }, function(err) {
        toastr.error($tr.instant("An error occured while creating folders. Please check your permissions."), {timeOut: 3000});
      });
    };

    $scope.factoryReset = function() {
      settings.deleteSettingsFile();
      zspin.reloadApp();
    };

    if ($scope.settings.firstRun) {
      toastr.info($tr.instant("Welcome to Zspin !<br/>Please configure me !"), {
        allowHtml: true,
        timeOut: 5000,
        extendedTimeOut: 5000,
      });
    }
  }
]);
