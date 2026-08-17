const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

let mainWindow;
let webWindow = null;
let harnessProcess = null;
let serverUrl = 'http://127.0.0.1:3080';

// 清除端口占用
function killPortProcess(port, callback) {
  const command = `netstat -ano | findstr :${port}`;

  exec(command, (error, stdout, stderr) => {
    if (error || !stdout) {
      callback(null);
      return;
    }

    const lines = stdout.trim().split('\n');
    const pids = new Set();

    lines.forEach(line => {
      const match = line.match(/LISTENING\s+(\d+)/);
      if (match) {
        pids.add(match[1]);
      }
    });

    if (pids.size === 0) {
      callback(null);
      return;
    }

    const pidArray = Array.from(pids);
    let killed = 0;

    pidArray.forEach(pid => {
      exec(`taskkill /F /PID ${pid}`, (err) => {
        killed++;
        if (killed === pidArray.length) {
          setTimeout(() => callback(null), 1000); // 等待端口完全释放
        }
      });
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    autoHideMenuBar: true,
    resizable: true
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    if (harnessProcess) {
      harnessProcess.kill();
    }
    if (webWindow) {
      webWindow.close();
    }
    mainWindow = null;
  });
}

function createWebWindow() {
  if (webWindow) {
    webWindow.focus();
    return;
  }

  webWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    autoHideMenuBar: true
  });

  webWindow.loadURL(serverUrl);

  webWindow.on('closed', () => {
    webWindow = null;
  });
}

// 启动 DeepSeek Harness
ipcMain.on('start-harness', (event) => {
  if (harnessProcess) {
    event.reply('log', '服务已在运行中...\n');
    return;
  }

  event.reply('log', '正在检查端口占用...\n');

  // 先清理端口
  killPortProcess(3080, () => {
    event.reply('log', '端口检查完成，正在启动 DeepSeek Harness...\n');
    event.reply('status-change', 'running');

    const isWindows = process.platform === 'win32';
    harnessProcess = spawn(
      isWindows ? 'cmd' : 'npx',
      isWindows ? ['/c', 'npx', '@deepseek-ai/dsh', 'web'] : ['@deepseek-ai/dsh', 'web'],
      {
        cwd: process.cwd(),
        shell: true
      }
    );

    harnessProcess.stdout.on('data', (data) => {
      event.reply('log', data.toString());
    });

    harnessProcess.stderr.on('data', (data) => {
      event.reply('log', data.toString());
    });

    harnessProcess.on('close', (code) => {
      event.reply('log', `\n进程退出，代码: ${code}\n`);
      event.reply('status-change', 'stopped');
      harnessProcess = null;
    });

    harnessProcess.on('error', (err) => {
      event.reply('log', `错误: ${err.message}\n`);
      event.reply('status-change', 'stopped');
      harnessProcess = null;
    });
  });
});

// 停止 DeepSeek Harness
ipcMain.on('stop-harness', (event) => {
  if (harnessProcess) {
    event.reply('log', '\n正在停止服务...\n');
    harnessProcess.kill();
    harnessProcess = null;
    event.reply('status-change', 'stopped');
    if (webWindow) {
      webWindow.close();
      webWindow = null;
    }
  } else {
    event.reply('log', '服务未运行\n');
  }
});

// 清除日志
ipcMain.on('clear-log', (event) => {
  event.reply('log-cleared');
});

// 打开浏览器
ipcMain.on('open-browser', (event) => {
  shell.openExternal(serverUrl);
});

// 在应用内打开
ipcMain.on('open-window', (event) => {
  createWebWindow();
});

// 清除端口占用
ipcMain.on('kill-port', (event) => {
  event.reply('log', '正在清除端口 3080 的占用进程...\n');
  killPortProcess(3080, () => {
    event.reply('log', '端口 3080 已清理完成\n');
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (harnessProcess) {
      harnessProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
