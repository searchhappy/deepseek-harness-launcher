@echo off
echo ========================================
echo   创建 Release 发布包
echo ========================================
echo.

cd /d "%~dp0"

REM 创建临时目录
if exist release-temp rmdir /s /q release-temp
mkdir release-temp
mkdir release-temp\deepseek-harness-launcher

echo [1/4] 复制源代码文件...

REM 复制核心文件
copy main.js release-temp\deepseek-harness-launcher\
copy setup-main.js release-temp\deepseek-harness-launcher\
copy index.html release-temp\deepseek-harness-launcher\
copy setup.html release-temp\deepseek-harness-launcher\
copy renderer.js release-temp\deepseek-harness-launcher\
copy setup.js release-temp\deepseek-harness-launcher\
copy styles.css release-temp\deepseek-harness-launcher\

REM 复制配置文件
copy package.json release-temp\deepseek-harness-launcher\
copy package-installer.json release-temp\deepseek-harness-launcher\
copy electron-builder-setup.json release-temp\deepseek-harness-launcher\

REM 复制文档
copy README.md release-temp\deepseek-harness-launcher\
copy README.zh-CN.md release-temp\deepseek-harness-launcher\
copy LICENSE release-temp\deepseek-harness-launcher\
copy .gitignore release-temp\deepseek-harness-launcher\

REM 复制资源文件
xcopy assets release-temp\deepseek-harness-launcher\assets\ /E /I /Y

echo [2/4] 创建使用说明文件...

REM 创建简单的使用说明
(
echo # DeepSeek Harness Desktop Launcher - 使用说明
echo.
echo ## 快速开始
echo.
echo 1. 安装 Node.js ^(v16+^): https://nodejs.org/
echo 2. 安装依赖: npm install
echo 3. 运行开发版: npm start
echo 4. 构建应用:
echo    - 标准版: npm run build:win
echo    - 安装版: npm run build:setup
echo.
echo ## 使用预编译版本
echo.
echo 从 Release 页面下载:
echo - DeepSeekHarness-Portable.exe ^(标准版^)
echo - DeepSeekHarness-Installer.exe ^(安装版^)
echo.
echo 详细文档请查看 README.md
) > release-temp\deepseek-harness-launcher\INSTALL.txt

echo [3/4] 打包源代码...

REM 使用 PowerShell 创建 zip
powershell -command "Compress-Archive -Path 'release-temp\deepseek-harness-launcher\*' -DestinationPath 'deepseek-harness-launcher-source.zip' -Force"

echo [4/4] 清理临时文件...
rmdir /s /q release-temp

echo.
echo ========================================
echo ✅ 发布包创建完成！
echo ========================================
echo.
echo 生成的文件：
echo - deepseek-harness-launcher-source.zip ^(源代码包^)
echo - dist\DeepSeekHarness-Portable.exe ^(标准版^)
echo - dist\DeepSeekHarness-Installer.exe ^(安装版^)
echo.
echo 请将这些文件上传到 GitHub Release！
echo.
pause
