'use strict';

var electron = require('electron');
var path = require('path');
var url = require('url');

var $window; // app.commandLine.appendSwitch('enable-smooth-scrolling'); 

function createWindow() {
  // BrowserWindow.addDevToolsExtension("C:\\Users\\Jake\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\2.5.2_0");
  // Create the browser window.
  $window = new electron.BrowserWindow({
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

electron.app.on('ready', createWindow);
electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});
electron.app.on('activate', function () {
  if ($window === null) {
    createWindow();
  }
});
