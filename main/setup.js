// setup.js - 安装向导前端逻辑（通过 preload 暴露的 window.setupApi 通信）
const api = window.setupApi;

if (!api) {
  const el = document.createElement('p');
  el.textContent = '预加载脚本加载失败，请重新安装应用';
  el.style.cssText = 'text-align:center;margin-top:40px;color:#c00;';
  document.body.innerHTML = '';
  document.body.appendChild(el);
  throw new Error('preload-setup.js 未加载，window.setupApi 不存在');
}

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
  const percent = Math.min(100, Math.round((completedSteps / totalSteps) * 100));
  progressFill.style.width = percent + '%';
}

function updateStep(stepId, status, message, icon) {
  const step = steps[stepId];
  const statusIcon = step.querySelector('.status-icon');
  const stepMessage = step.querySelector('.step-message');

  step.className = 'step ' + status;
  statusIcon.textContent = icon;
  stepMessage.textContent = message;

  // 只有终态（成功/失败）才推进进度；同一步骤的终态只计数一次
  if ((status === 'success' || status === 'error') && step.dataset.final !== 'true') {
    step.dataset.final = 'true';
    completedSteps = Math.min(totalSteps, completedSteps + 1);
    updateProgress();
  }
}

// 启动主应用
launchBtn.addEventListener('click', () => {
  launchBtn.disabled = true;
  launchBtn.textContent = '正在启动...';
  api.launchMain();
});

// 接收检查结果
api.onCheckNodejs((data) => {
  if (data.installed) {
    updateStep('nodejs', 'success', `已安装 Node.js ${data.version}`, '✅');
    api.checkDsh();
  } else {
    updateStep('nodejs', 'error', 'Node.js 未安装，请下载安装：', '❌');
    const messageDiv = steps.nodejs.querySelector('.step-message');
    messageDiv.appendChild(document.createElement('br'));
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = '下载 Node.js';
    btn.addEventListener('click', () => api.openUrl('https://nodejs.org/'));
    messageDiv.appendChild(btn);
  }
});

api.onCheckDsh((data) => {
  if (data.installed) {
    updateStep('dsh', 'success', 'DeepSeek Harness 已安装', '✅');
    actionButtons.style.display = 'flex';
  } else {
    updateStep('dsh', 'checking', '正在安装 DeepSeek Harness...', '⏳');
    api.installDsh();
  }
});

api.onInstallProgress((message) => {
  const messageDiv = steps.dsh.querySelector('.step-message');
  messageDiv.textContent = message;
});

api.onInstallComplete((success) => {
  if (success) {
    updateStep('dsh', 'success', 'DeepSeek Harness 安装完成', '✅');
    actionButtons.style.display = 'flex';
  } else {
    updateStep('dsh', 'error', '安装失败，请检查网络连接：', '❌');
    const messageDiv = steps.dsh.querySelector('.step-message');
    messageDiv.appendChild(document.createElement('br'));
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = '重试安装';
    btn.addEventListener('click', () => {
      delete steps.dsh.dataset.final;
      updateStep('dsh', 'checking', '正在重试安装...', '⏳');
      api.installDsh();
    });
    messageDiv.appendChild(btn);
  }
});

// 启动检查
api.checkNodejs();
