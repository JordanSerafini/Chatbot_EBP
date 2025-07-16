const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let robotWindow = null;
let chatWindow = null;

function createRobotWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  robotWindow = new BrowserWindow({
    width: 120,
    height: 120,
    x: width - 140,
    y: height - 140,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  robotWindow.loadFile(path.join(__dirname, 'robot.html'));
  robotWindow.setIgnoreMouseEvents(false);
  robotWindow.on('closed', () => { robotWindow = null; });
}

function createChatWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  chatWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: Math.round((width - 400) / 2),
    y: Math.round((height - 600) / 2),
    frame: true,
    transparent: false,
    alwaysOnTop: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  chatWindow.loadFile(path.join(__dirname, 'chat.html'));
  chatWindow.on('closed', () => { chatWindow = null; });
}

app.whenReady().then(() => {
  createRobotWindow();

  ipcMain.on('open-chat', () => {
    if (robotWindow) robotWindow.close();
    createChatWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createRobotWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
}); 