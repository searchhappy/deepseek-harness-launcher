@echo off
echo ========================================
echo   DeepSeek Harness 智能安装版
echo ========================================
echo.
echo 正在启动安装向导...
echo.

cd /d "%~dp0"
electron setup-main.js

pause
