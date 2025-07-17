const { contextBridge, ipcRenderer, clipboard, shell, Notification } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openChat: () => ipcRenderer.send('open-chat'),
  onBotResponse: (callback) => ipcRenderer.on('bot-response', callback),
  notify: (title, body) => {
    new Notification({ title, body }).show();
  },
  copyToClipboard: (text) => clipboard.writeText(text)
}); 