const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

let setupWindow;
let mainWindow;

function createSetupWindow() {
  setupWindow = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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

function createMainWindow() {
  if (setupWindow) {
    setupWindow.close();
  }

  const main = require('./main.js');
}

// 检查 Node.js
ipcMain.on('check-nodejs', (event) => {
  exec('node --version', (error, stdout) => {
    if (error) {
      event.reply('check-nodejs', { installed: false });
    } else {
      event.reply('check-nodejs', {
        installed: true,
        version: stdout.trim()
      });
    }
  });
});

// 检查 DeepSeek Harness
ipcMain.on('check-dsh', (event) => {
  exec('npx @deepseek-ai/dsh --version', (error, stdout) => {
    event.reply('check-dsh', { installed: !error });
  });
});

// 安装 DeepSeek Harness
ipcMain.on('install-dsh', (event) => {
  event.reply('install-dsh-progress', '正在下载 DeepSeek Harness...');

  const installProcess = spawn('npx', ['@deepseek-ai/dsh', '--help'], {
    shell: true
  });

  installProcess.stdout.on('data', (data) => {
    event.reply('install-dsh-progress', '正在安装...');
  });

  installProcess.on('close', (code) => {
    event.reply('install-dsh-complete', code === 0);
  });

  installProcess.on('error', () => {
    event.reply('install-dsh-complete', false);
  });
});

// 打开 URL
ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url);
});

// 启动主应用
ipcMain.on('launch-main', () => {
  if (setupWindow) {
    setupWindow.close();
  }

  // 动态加载主应用逻辑
  delete require.cache[require.resolve('./main.js')];
  require('./main.js');
});

app.whenReady().then(createSetupWindow);

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
