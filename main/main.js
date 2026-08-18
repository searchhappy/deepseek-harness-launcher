const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

const SERVER_URL = 'http://127.0.0.1:3080';
const SERVER_PORT = 3080;
const isWindows = process.platform === 'win32';

let mainWindow;
let webWindow = null;
let harnessProcess = null;
let ipcRegistered = false;

// 清除端口占用（仅匹配真正 LISTENING 的 PID，避免误杀 :30800 之类的进程）
function killPortProcess(port, callback) {
  if (!isWindows) {
    // 非 Windows 平台：用 lsof 兜底（本应用主要面向 Windows，此处尽力而为）
    exec(`lsof -ti tcp:${port} | xargs -r kill -9`, () => callback && callback());
    return;
  }

  const command = `netstat -ano | findstr :${port}`;

  exec(command, (error, stdout) => {
    if (error || !stdout) {
      callback && callback();
      return;
    }

    const lines = stdout.trim().split('\n');
    const pids = new Set();

    lines.forEach(line => {
      // netstat 输出形如: TCP    0.0.0.0:3080    0.0.0.0:0    LISTENING    1234
      const match = line.match(/:${port}\s+\S+\s+LISTENING\s+(\d+)/i);
      if (match) {
        pids.add(match[1]);
      }
    });

    if (pids.size === 0) {
      callback && callback();
      return;
    }

    const pidArray = Array.from(pids);
    let killed = 0;

    pidArray.forEach(pid => {
      exec(`taskkill /F /PID ${pid}`, () => {
        killed++;
        if (killed === pidArray.length) {
          setTimeout(() => callback && callback(), 1000); // 等待端口完全释放
        }
      });
    });
  });
}

// 终止整个进程树（cmd -> npx -> node），避免残留子进程
function killProcessTree(proc, callback) {
  if (!proc || !proc.pid) {
    callback && callback();
    return;
  }

  if (isWindows) {
    exec(`taskkill /PID ${proc.pid} /T /F`, () => callback && callback());
  } else {
    try {
      process.kill(-proc.pid, 'SIGTERM');
    } catch (err) {
      try { proc.kill('SIGKILL'); } catch (e) { /* 已退出 */ }
    }
    callback && callback();
  }
}

// 停止服务：杀进程树 + 关闭内嵌窗口
function stopHarness(reason) {
  if (harnessProcess) {
    if (reason) {
      sendToMain('log', `\n${reason}\n`);
    }
    killProcessTree(harnessProcess);
    harnessProcess = null;
  }
  if (webWindow) {
    webWindow.close();
    webWindow = null;
  }
}

// 给主窗口发消息（窗口可能不存在时安全返回）
function sendToMain(channel, ...args) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    autoHideMenuBar: true,
    resizable: true
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    stopHarness('应用窗口已关闭，服务已停止');
    mainWindow = null;
  });
}

function createWebWindow() {
  if (webWindow) {
    webWindow.focus();
    return;
  }

  if (!harnessProcess) {
    sendToMain('log', '请先启动服务，再打开应用内窗口\n');
    return;
  }

  // 内嵌窗口加载的是 dsh 服务页面（外部内容），不注入本地 preload
  webWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    autoHideMenuBar: true
  });

  loadUrlWithRetry(webWindow, SERVER_URL, 0);
}

// 服务启动需要时间，加载失败时自动重试（最多约 30 秒）
function loadUrlWithRetry(win, url, attempt) {
  if (!win || win.isDestroyed()) return;

  win.loadURL(url).catch(() => {});

  win.webContents.once('did-fail-load', (_e, errorCode, errorDesc, failedUrl, isMainFrame) => {
    // 只处理主框架的加载失败；子资源失败忽略
    if (!isMainFrame || failedUrl !== url) return;
    if (attempt >= 15) {
      sendToMain('log', `无法连接 ${url}（${errorDesc}），请在服务启动后重新打开\n`);
      return;
    }
    setTimeout(() => loadUrlWithRetry(win, url, attempt + 1), 2000);
  });
}

// 启动 DeepSeek Harness
function handleStart(event) {
  if (harnessProcess) {
    event.reply('log', '服务已在运行中...\n');
    return;
  }

  event.reply('log', '正在检查端口占用...\n');

  killPortProcess(SERVER_PORT, () => {
    event.reply('log', '端口检查完成，正在启动 DeepSeek Harness...\n');

    // --yes: 避免 npx 在非交互模式下询问 "Ok to proceed?" 导致挂起
    const args = ['--yes', '@deepseek-ai/dsh', 'web'];
    harnessProcess = spawn(
      isWindows ? 'cmd' : 'npx',
      isWindows ? ['/c', 'npx', ...args] : args,
      {
        cwd: process.cwd(),
        shell: false,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      }
    );

    harnessProcess.stdout.on('data', (data) => {
      event.reply('log', data.toString());
    });

    harnessProcess.stderr.on('data', (data) => {
      event.reply('log', data.toString());
    });

    harnessProcess.on('spawn', () => {
      event.reply('status-change', 'running');
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
}

// 注册 IPC 处理器（带防重复注册保护，供安装版动态加载时安全复用）
function registerIpcHandlers() {
  if (ipcRegistered) return;
  ipcRegistered = true;

  ipcMain.on('start-harness', handleStart);

  ipcMain.on('stop-harness', (event) => {
    if (harnessProcess) {
      event.reply('log', '\n正在停止服务...\n');
      stopHarness();
      event.reply('status-change', 'stopped');
    } else {
      event.reply('log', '服务未运行\n');
    }
  });

  ipcMain.on('clear-log', (event) => {
    event.reply('log-cleared');
  });

  ipcMain.on('open-browser', (event) => {
    if (!harnessProcess) {
      event.reply('log', '请先启动服务，再在浏览器中打开\n');
      return;
    }
    shell.openExternal(SERVER_URL);
  });

  ipcMain.on('open-window', () => {
    createWebWindow();
  });

  ipcMain.on('kill-port', (event) => {
    event.reply('log', `正在清除端口 ${SERVER_PORT} 的占用进程...\n`);
    killPortProcess(SERVER_PORT, () => {
      event.reply('log', `端口 ${SERVER_PORT} 已清理完成\n`);
    });
  });
}

// 启动主应用（供 setup-main.js 动态加载；直接运行时由 require.main 检查触发）
function startMainApp() {
  registerIpcHandlers();
  app.whenReady().then(() => {
    if (!mainWindow) {
      createWindow();
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopHarness();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 直接运行时（electron .）自动启动；被 setup-main.js require 时不自动启动
if (require.main === module) {
  startMainApp();
}

module.exports = { startMainApp };
