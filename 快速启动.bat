@echo off
echo ========================================
echo   DeepSeek Harness 快速启动器
echo ========================================
echo.
echo 这是一个便携版启动器，无需构建安装包
echo 直接运行 Electron 应用
echo.
echo 正在检查依赖...

cd /d "%~dp0"

if not exist "node_modules" (
    echo.
    echo 首次运行需要安装依赖，请稍候...
    echo.
    call npm install
)

echo.
echo 正在启动 DeepSeek Harness Launcher...
echo.
start "" npm start

echo.
echo 应用已在后台启动
echo 如需关闭，请直接关闭应用窗口
echo.
pause
