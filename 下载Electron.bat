@echo off
echo ========================================
echo   手动下载 Electron (使用国内镜像)
echo ========================================
echo.

cd /d "%~dp0"

REM 设置环境变量
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_CUSTOM_DIR=28.3.3

echo 正在从国内镜像下载 Electron 28.3.3...
echo 这可能需要几分钟
echo.

REM 使用 npm 安装 electron，它会自动使用镜像
call npm install electron@28.3.3 --save-dev

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Electron 下载完成！
    echo 现在可以运行"构建安装包.bat"了
    echo ========================================
) else (
    echo.
    echo 下载失败，请检查网络连接
)

echo.
pause
