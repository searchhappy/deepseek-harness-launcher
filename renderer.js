const { ipcRenderer } = require('electron');

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const killPortBtn = document.getElementById('killPortBtn');
const openBtn = document.getElementById('openBtn');
const openWindowBtn = document.getElementById('openWindowBtn');
const logOutput = document.getElementById('logOutput');
const statusBadge = document.getElementById('status');

let isRunning = false;

// 启动服务
startBtn.addEventListener('click', () => {
  ipcRenderer.send('start-harness');
  startBtn.disabled = true;
});

// 停止服务
stopBtn.addEventListener('click', () => {
  ipcRenderer.send('stop-harness');
  stopBtn.disabled = true;
});

// 清除日志
clearBtn.addEventListener('click', () => {
  ipcRenderer.send('clear-log');
});

// 清除端口占用
killPortBtn.addEventListener('click', () => {
  ipcRenderer.send('kill-port');
});

// 在浏览器中打开
openBtn.addEventListener('click', () => {
  ipcRenderer.send('open-browser');
});

// 在应用内打开
openWindowBtn.addEventListener('click', () => {
  ipcRenderer.send('open-window');
});

// 接收日志
ipcRenderer.on('log', (event, data) => {
  if (logOutput.textContent === '等待启动服务...') {
    logOutput.textContent = '';
  }
  logOutput.textContent += data;
  logOutput.scrollTop = logOutput.scrollHeight;
});

// 日志已清除
ipcRenderer.on('log-cleared', () => {
  logOutput.textContent = '日志已清除\n';
});

// 状态变化
ipcRenderer.on('status-change', (event, status) => {
  if (status === 'running') {
    isRunning = true;
    statusBadge.textContent = '运行中';
    statusBadge.className = 'status-badge running';
    startBtn.disabled = true;
    stopBtn.disabled = false;
    openWindowBtn.disabled = false;
  } else if (status === 'stopped') {
    isRunning = false;
    statusBadge.textContent = '未运行';
    statusBadge.className = 'status-badge stopped';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    openWindowBtn.disabled = true;
  }
});
