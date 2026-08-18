// preload-setup.js - 安装向导渲染进程安全桥接
// 通过 contextBridge 暴露最小化 API，替代 nodeIntegration: true
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('setupApi', {
  // 操作
  checkNodejs: () => ipcRenderer.send('check-nodejs'),
  checkDsh: () => ipcRenderer.send('check-dsh'),
  installDsh: () => ipcRenderer.send('install-dsh'),
  openUrl: (url) => ipcRenderer.send('open-url', url),
  launchMain: () => ipcRenderer.send('launch-main'),

  // 事件订阅（返回取消订阅函数）
  onCheckNodejs: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('check-nodejs-result', listener);
    return () => ipcRenderer.removeListener('check-nodejs-result', listener);
  },
  onCheckDsh: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('check-dsh-result', listener);
    return () => ipcRenderer.removeListener('check-dsh-result', listener);
  },
  onInstallProgress: (callback) => {
    const listener = (_event, message) => callback(message);
    ipcRenderer.on('install-dsh-progress', listener);
    return () => ipcRenderer.removeListener('install-dsh-progress', listener);
  },
  onInstallComplete: (callback) => {
    const listener = (_event, success) => callback(success);
    ipcRenderer.on('install-dsh-complete', listener);
    return () => ipcRenderer.removeListener('install-dsh-complete', listener);
  }
});
