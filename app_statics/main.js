var gui = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var pjson = require('./package.json');

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

gui.commandLine.appendSwitch('ppapi-flash-path', ppapiPath);
// seems useless
//gui.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.209');

gui.on('window-all-closed', function() {
  gui.quit();
});

gui.on('ready', function() {
  // Disable fullscreen if we are in debug.

  if (pjson.debug) {
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
  if (pjson.debug) {
    mainWindow.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
