const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const env = JSON.parse(fs.readFileSync(__dirname + '/env.json', 'utf8'));
// const { checkUpdate, saveOrUpdateClientInfo } = require('./src/auto-updater')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 930, height: 700,icon: path.join(__dirname, 'voc.ico') })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

  const template = [{
    label: "显示",
    submenu: [
      {
        label: "开发者工具",
        click: function () {
          win.webContents.openDevTools()
        }
      }
    ]
  }]
  const menu = Menu.buildFromTemplate(template)
  if (env.production) {
    Menu.setApplicationMenu(menu)
  }

  // 加载 vueDevtool chrome 扩展
  if (env.vueDevtool.enabled) {
    let vueDevtool = env.vueDevtool.extension // '/Users/basten/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/3.1.6_0'
    BrowserWindow.addDevToolsExtension(vueDevtool)
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }

  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
