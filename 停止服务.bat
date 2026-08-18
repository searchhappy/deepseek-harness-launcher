@echo off
echo ========================================
echo   停止占用 3080 端口的进程
echo ========================================
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3080 ^| findstr LISTENING') do (
    echo 找到占用端口的进程 PID: %%a
    taskkill //F //PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo 成功停止进程 %%a
    )
)

timeout /t 2 >nul

echo.
echo 端口 3080 已释放
echo.
pause
