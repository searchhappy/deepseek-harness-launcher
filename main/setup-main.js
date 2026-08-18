const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const DSH_PACKAGE = '@deepseek-ai/dsh';

let setupWindow;

function createSetupWindow() {
  setupWindow = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload-setup.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    autoHideMenuBar: true,
    resizable: false
  });

  setupWindow.loadFile('setup.html');

  setupWindow.on('closed', () => {
    setupWindow = null;
  });
}

// 检查 Node.js
function handleCheckNodejs(event) {
  exec('node --version', (error, stdout) => {
    if (error) {
      event.reply('check-nodejs-result', { installed: false });
    } else {
      event.reply('check-nodejs-result', {
        installed: true,
        version: stdout.trim()
      });
    }
  });
}

// 检查 DeepSeek Harness（--no-install：只查缓存，不触发下载，避免非交互挂起）
function handleCheckDsh(event) {
  exec(`npx --no-install ${DSH_PACKAGE} --version`, (error) => {
    event.reply('check-dsh-result', { installed: !error });
  });
}

// 安装 DeepSeek Harness（--yes：非交互环境直接确认下载）
function handleInstallDsh(event) {
  event.reply('install-dsh-progress', '正在下载 DeepSeek Harness...');

  const args = ['--yes', DSH_PACKAGE, '--version'];
  const installProcess = spawn(
    isWindows ? 'cmd' : 'npx',
    isWindows ? ['/c', 'npx', ...args] : args,
    {
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  installProcess.stdout.on('data', () => {
    event.reply('install-dsh-progress', '正在安装...');
  });

  installProcess.stderr.on('data', () => {
    event.reply('install-dsh-progress', '正在安装...');
  });

  installProcess.on('close', (code) => {
    event.reply('install-dsh-complete', code === 0);
  });

  installProcess.on('error', (err) => {
    event.reply('install-dsh-progress', `安装失败: ${err.message}`);
    event.reply('install-dsh-complete', false);
  });
}

// 打开 URL
function handleOpenUrl(_event, url) {
  shell.openExternal(url);
}

// 启动主应用
function handleLaunchMain() {
  // 动态加载主应用逻辑（只加载一次，不再重复 require）
  const { startMainApp } = require('./main.js');
  startMainApp(() => {
    // 主窗口已创建后再关闭向导窗口，避免 window-all-closed 竞态导致应用提前退出
    if (setupWindow) {
      setupWindow.close();
    }
  });
}

app.whenReady().then(() => {
  ipcMain.on('check-nodejs', handleCheckNodejs);
  ipcMain.on('check-dsh', handleCheckDsh);
  ipcMain.on('install-dsh', handleInstallDsh);
  ipcMain.on('open-url', handleOpenUrl);
  ipcMain.on('launch-main', handleLaunchMain);

  createSetupWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (setupWindow === null) {
    createSetupWindow();
  }
});
