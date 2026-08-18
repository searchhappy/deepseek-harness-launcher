// preload.js - 标准版渲染进程安全桥接
// 通过 contextBridge 暴露最小化 API，替代 nodeIntegration: true
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('launcher', {
  // 操作
  start: () => ipcRenderer.send('start-harness'),
  stop: () => ipcRenderer.send('stop-harness'),
  clearLog: () => ipcRenderer.send('clear-log'),
  killPort: () => ipcRenderer.send('kill-port'),
  openBrowser: () => ipcRenderer.send('open-browser'),
  openWindow: () => ipcRenderer.send('open-window'),

  // 事件订阅（返回取消订阅函数）
  onLog: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('log', listener);
    return () => ipcRenderer.removeListener('log', listener);
  },
  onLogCleared: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('log-cleared', listener);
    return () => ipcRenderer.removeListener('log-cleared', listener);
  },
  onStatusChange: (callback) => {
    const listener = (_event, status) => callback(status);
    ipcRenderer.on('status-change', listener);
    return () => ipcRenderer.removeListener('status-change', listener);
  }
});
