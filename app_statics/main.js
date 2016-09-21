const electron = require('electron');
const gui = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const pjson = require('./package.json');
const argv = require('argv');

var mainWindow = null;

// Flash PPAPI plugin
var ppapiPath = null;

// test if we are in an asar package
if (__dirname.indexOf('app.asar') > -1) {
  if (process.platform == 'win32') {
    ppapiPath = __dirname.replace('app.asar', 'pepflashplayer.dll');
  } else if (process.platform == 'darwin') {
    ppapiPath = __dirname.replace('app.asar', 'PepperFlashPlayer.plugin');
  } else if (process.platform == 'linux') {
    ppapiPath = __dirname.replace('app.asar', 'libpepflashplayer.so');
  }

// else we are not in an asar package
} else {
  if (process.platform == 'win32') {
    ppapiPath = __dirname+'\\plugins\\pepflashplayer.dll';
  } else if (process.platform == 'darwin') {
    ppapiPath = __dirname+'/plugins/PepperFlashPlayer.plugin';
  } else if (process.platform == 'linux') {
    ppapiPath = __dirname+'/plugins/libpepflashplayer.so';
  }
}

// process cli arguments
// https://github.com/atom/electron/issues/4690#issuecomment-193205675
if (process.argv[1] && process.argv[1].indexOf('-') === 0) { process.argv.unshift(''); }

global['options'] = argv.option([
  {name: 'debug', short: 'd', type: 'boolean', description: 'Open developper tools at launch.'},
  {name: 'debug-webview', short: 'w', type: 'boolean', description: 'Open developper tools for html themes.'},
  {name: 'mute', short: 'm', type: 'boolean', description: 'Mute sound (usually used with debug).'},
  {name: 'reset', short: 'r', type: 'boolean', description: 'Reset configuration file to default.'},
]).run().options;

if (global['options'].help) {
  process.stdout.write(argv.help());
  process.exit(0);
}

gui.commandLine.appendSwitch('ppapi-flash-path', ppapiPath);
// seems useless
//gui.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.209');

gui.on('window-all-closed', function() {
  gui.quit();
});

gui.on('ready', function() {
  // Disable fullscreen if we are in debug.
  if (global['options'].debug) {
    pjson.window.fullscreen = false;
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: pjson.window.title,
    width: pjson.window.width,
    height: pjson.window.height,
    backgroundColor: '#000000',
    fullscreen: pjson.window.fullscreen,
    icon: pjson.window.icon,
    'web-preferences': {
      'plugins': true,
    }
  });

  // and load the index.html of the gui.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the devtools if we are in debug.
  if (global['options'].debug) {
    mainWindow.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
