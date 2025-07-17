// Main process Electron sécurisé avec preload, logs, gestion fenêtres, etc.
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

let robotWindow = null;
let chatWindow = null;

function log(action, details = {}) {
  const logMsg = `[${new Date().toISOString()}] ${action} ${JSON.stringify(details)}\n`;
  fs.appendFileSync(path.join(app.getPath('userData'), 'app.log'), logMsg);
}

function createRobotWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  const robotSize = 200;
  const margin = 20;
  robotWindow = new BrowserWindow({
    width: robotSize,
    height: robotSize,
    x: margin,
    y: height - robotSize - margin,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    roundedCorners: true,
    backgroundColor: '#00000000',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    },
  });
  console.log('Robot path:', path.join(__dirname, '../renderer/robot.html'));
  robotWindow.loadFile(path.join(__dirname, '../renderer/robot.html'));
  robotWindow.setIgnoreMouseEvents(false);
  robotWindow.once('ready-to-show', () => robotWindow.show());
  robotWindow.on('closed', () => { robotWindow = null; log('robotWindow.closed'); });
  log('robotWindow.opened');
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
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    },
  });
  chatWindow.loadFile(path.join(__dirname, '../renderer/chat.html'));
  chatWindow.on('closed', () => { chatWindow = null; log('chatWindow.closed'); });
  log('chatWindow.opened');
}

app.whenReady().then(() => {
  createRobotWindow();
  log('app.ready');

  ipcMain.on('open-chat', () => {
    if (robotWindow) robotWindow.close();
    createChatWindow();
    log('open-chat');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createRobotWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  log('app.quit');
}); 