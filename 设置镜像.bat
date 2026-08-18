@echo off
echo ========================================
echo   设置国内镜像加速
echo ========================================
echo.
echo 正在配置 npm 和 Electron 镜像...
echo.

call npm config set registry https://registry.npmmirror.com
call npm config set electron_mirror https://npmmirror.com/mirrors/electron/
call npm config set electron_builder_binaries_mirror https://npmmirror.com/mirrors/electron-builder-binaries/

echo.
echo ========================================
echo 镜像配置完成！
echo ========================================
echo.
echo 配置内容：
echo - npm 镜像: https://registry.npmmirror.com
echo - Electron 镜像: https://npmmirror.com/mirrors/electron/
echo - Builder 镜像: https://npmmirror.com/mirrors/electron-builder-binaries/
echo.
echo 现在可以重新运行"构建安装包.bat"
echo.
pause
