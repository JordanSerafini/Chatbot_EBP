const { contextBridge, ipcRenderer, clipboard, shell, Notification } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  openChat: () => ipcRenderer.send('open-chat'),
  onBotResponse: (callback) => ipcRenderer.on('bot-response', callback),
  notify: (title, body) => {
    new Notification({ title, body }).show();
  },
  copyToClipboard: (text) => clipboard.writeText(text),
  exportFile: (filename, content) => {
    const filePath = path.join(app.getPath('downloads'), filename);
    fs.writeFileSync(filePath, content);
    shell.showItemInFolder(filePath);
  }
}); 