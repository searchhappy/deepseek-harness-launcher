const { ipcRenderer } = require('electron');

const steps = {
  nodejs: document.getElementById('step-nodejs'),
  dsh: document.getElementById('step-dsh')
};

const progressFill = document.getElementById('progress-fill');
const actionButtons = document.getElementById('action-buttons');
const launchBtn = document.getElementById('launch-btn');

let totalSteps = 2;
let completedSteps = 0;

function updateProgress() {
  const percent = (completedSteps / totalSteps) * 100;
  progressFill.style.width = percent + '%';
}

function updateStep(stepId, status, message, icon) {
  const step = steps[stepId];
  const statusIcon = step.querySelector('.status-icon');
  const stepMessage = step.querySelector('.step-message');

  step.className = 'step ' + status;
  statusIcon.textContent = icon;
  stepMessage.textContent = message;

  if (status === 'success' || status === 'error') {
    completedSteps++;
    updateProgress();
  }
}

// 启动主应用
launchBtn.addEventListener('click', () => {
  ipcRenderer.send('launch-main');
});

// 接收检查结果
ipcRenderer.on('check-nodejs', (event, data) => {
  if (data.installed) {
    updateStep('nodejs', 'success', `已安装 Node.js ${data.version}`, '✅');
    ipcRenderer.send('check-dsh');
  } else {
    updateStep('nodejs', 'error', 'Node.js 未安装', '❌');
    const messageDiv = steps.nodejs.querySelector('.step-message');
    messageDiv.innerHTML = `
      Node.js 未安装，请下载安装：<br>
      <button class="btn btn-primary" onclick="openNodejsDownload()">
        下载 Node.js
      </button>
    `;
  }
});

ipcRenderer.on('check-dsh', (event, data) => {
  if (data.installed) {
    updateStep('dsh', 'success', 'DeepSeek Harness 已安装', '✅');
    actionButtons.style.display = 'flex';
  } else {
    updateStep('dsh', 'checking', '正在安装 DeepSeek Harness...', '⏳');
    ipcRenderer.send('install-dsh');
  }
});

ipcRenderer.on('install-dsh-progress', (event, message) => {
  const messageDiv = steps.dsh.querySelector('.step-message');
  messageDiv.textContent = message;
});

ipcRenderer.on('install-dsh-complete', (event, success) => {
  if (success) {
    updateStep('dsh', 'success', 'DeepSeek Harness 安装完成', '✅');
    actionButtons.style.display = 'flex';
  } else {
    updateStep('dsh', 'error', '安装失败，请检查网络连接', '❌');
    const messageDiv = steps.dsh.querySelector('.step-message');
    messageDiv.innerHTML = `
      安装失败，请手动安装：<br>
      <button class="btn btn-primary" onclick="manualInstall()">
        重试安装
      </button>
    `;
  }
});

function openNodejsDownload() {
  ipcRenderer.send('open-url', 'https://nodejs.org/');
}

function manualInstall() {
  ipcRenderer.send('install-dsh');
  updateStep('dsh', 'checking', '正在重试安装...', '⏳');
}

// 启动检查
ipcRenderer.send('check-nodejs');
