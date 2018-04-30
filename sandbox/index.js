const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow;

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    height: 1000,
    width: 1000
  });

  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));
  mainWindow.openDevTools({ mode: 'bottom' });
});
