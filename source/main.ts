import { app, BrowserWindow, BrowserView } from 'electron'
import * as path from 'path'
import * as url from 'url'

let $window: BrowserWindow | null

// app.commandLine.appendSwitch('enable-smooth-scrolling'); 

function createWindow() {
    // BrowserWindow.addDevToolsExtension("C:\\Users\\Jake\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\2.5.2_0");
    // Create the browser window.
    
    $window = new BrowserWindow({ width: 800, height: 600 })
    
    $window.setMenu(null)
    
    $window.loadURL(url.format({
        pathname: path.join(__dirname, '../public/index.html'),
        protocol: 'file:',
        slashes: true
    }))
    
    $window.webContents.openDevTools()
    
    $window.on('closed', () => {
        $window = null
    })
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if ($window === null) {
        createWindow()
    }
})