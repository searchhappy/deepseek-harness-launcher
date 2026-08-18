@echo off
echo ========================================
echo   构建两个版本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] 正在构建标准便携版...
echo.
call npm run build:win

if %errorlevel% equ 0 (
    echo.
    echo ✅ 标准便携版构建完成
    echo.
) else (
    echo.
    echo ❌ 标准便携版构建失败
    pause
    exit /b 1
)

echo [2/2] 正在构建智能安装版...
echo.
call npm run build:setup

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ 所有版本构建完成！
    echo.
    echo 输出文件位于 dist 目录：
    echo - DeepSeekHarness-Portable.exe  (标准版)
    echo - DeepSeekHarness-Installer.exe (安装版)
    echo ========================================
) else (
    echo.
    echo ❌ 智能安装版构建失败
)

echo.
pause
