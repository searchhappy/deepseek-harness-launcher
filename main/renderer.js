// renderer.js - 标准版前端逻辑（通过 preload 暴露的 window.launcher 通信）
const api = window.launcher;

if (!api) {
  const el = document.createElement('p');
  el.textContent = '预加载脚本加载失败，请重新安装应用';
  el.style.cssText = 'text-align:center;margin-top:40px;color:#c00;';
  document.body.innerHTML = '';
  document.body.appendChild(el);
  throw new Error('preload.js 未加载，window.launcher 不存在');
}

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const killPortBtn = document.getElementById('killPortBtn');
const openBtn = document.getElementById('openBtn');
const openWindowBtn = document.getElementById('openWindowBtn');
const logOutput = document.getElementById('logOutput');
const statusBadge = document.getElementById('status');

// 启动服务
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  api.start();
});

// 停止服务
stopBtn.addEventListener('click', () => {
  stopBtn.disabled = true;
  api.stop();
});

// 清除日志
clearBtn.addEventListener('click', () => {
  api.clearLog();
});

// 清除端口占用
killPortBtn.addEventListener('click', () => {
  api.killPort();
});

// 在浏览器中打开
openBtn.addEventListener('click', () => {
  api.openBrowser();
});

// 在应用内打开
openWindowBtn.addEventListener('click', () => {
  api.openWindow();
});

// 接收日志
api.onLog((data) => {
  if (logOutput.textContent === '等待启动服务...') {
    logOutput.textContent = '';
  }
  logOutput.textContent += data;
  logOutput.scrollTop = logOutput.scrollHeight;
});

// 日志已清除
api.onLogCleared(() => {
  logOutput.textContent = '日志已清除\n';
});

// 状态变化
api.onStatusChange((status) => {
  if (status === 'running') {
    statusBadge.textContent = '运行中';
    statusBadge.className = 'status-badge running';
    startBtn.disabled = true;
    stopBtn.disabled = false;
    openWindowBtn.disabled = false;
  } else if (status === 'stopped') {
    statusBadge.textContent = '未运行';
    statusBadge.className = 'status-badge stopped';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    openWindowBtn.disabled = true;
  }
});
