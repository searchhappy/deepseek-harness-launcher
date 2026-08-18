@echo off
echo ========================================
echo   构建 DeepSeek Harness 安装程序
echo ========================================
echo.
echo 正在设置国内镜像加速下载...
echo.

cd /d "%~dp0"

REM 设置环境变量使用国内镜像
set ELECTRON_MIRROR=https://nppmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

echo 镜像地址：
echo - Electron: %ELECTRON_MIRROR%
echo - Builder: %ELECTRON_BUILDER_BINARIES_MIRROR%
echo.
echo 正在构建 Windows 安装包...
echo 首次构建需要下载依赖，请耐心等待（约 5-15 分钟）
echo.

call npm run build:win

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 构建完成！
    echo 安装程序位于 dist 目录
    echo ========================================
) else (
    echo.
    echo ========================================
    echo 构建失败
    echo.
    echo 可能的原因：
    echo 1. 网络连接问题 - 建议使用代理或 VPN
    echo 2. 磁盘空间不足
    echo.
    echo 备选方案：
    echo - 直接使用"快速启动.bat"运行应用（无需构建）
    echo - 稍后重试构建
    echo ========================================
)

echo.
pause
