"use strict";

var _electron = require("electron");

var path = _interopRequireWildcard(require("path"));

var url = _interopRequireWildcard(require("url"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var $window; // app.commandLine.appendSwitch('enable-smooth-scrolling'); 

function createWindow() {
  // BrowserWindow.addDevToolsExtension("C:\\Users\\Jake\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\2.5.2_0");
  // Create the browser window.
  $window = new _electron.BrowserWindow({
    width: 800,
    height: 600
  });
  $window.setMenu(null);
  $window.loadURL(url.format({
    pathname: path.join(__dirname, '../public/index.html'),
    protocol: 'file:',
    slashes: true
  }));
  $window.webContents.openDevTools();
  $window.on('closed', function () {
    $window = null;
  });
}

_electron.app.on('ready', createWindow);

_electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    _electron.app.quit();
  }
});

_electron.app.on('activate', function () {
  if ($window === null) {
    createWindow();
  }
});