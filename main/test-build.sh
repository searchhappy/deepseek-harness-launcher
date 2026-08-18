#!/bin/bash

# 安装程序构建测试脚本

echo "======================================"
echo "  DeepSeek Harness 安装程序构建测试"
echo "======================================"
echo ""

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 main 目录中运行此脚本"
    echo "   cd main && ./test-build.sh"
    exit 1
fi

echo "✅ 当前目录正确"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"
echo ""

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未安装 npm"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm 版本: $NPM_VERSION"
echo ""

# 检查必需文件
echo "检查必需文件..."
FILES=("main.js" "index.html" "renderer.js" "styles.css" "assets/icon.ico")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ 缺少: $file"
        exit 1
    fi
done
echo ""

# 检查配置文件
echo "检查配置文件..."
CONFIGS=("electron-builder-nsis.json" "electron-builder-installer-setup.json")

for config in "${CONFIGS[@]}"; do
    if [ -f "$config" ]; then
        echo "  ✅ $config"
    else
        echo "  ⚠️  缺少: $config"
    fi
done
echo ""

# 检查 macOS 图标
if [ -f "assets/icon.icns" ]; then
    echo "✅ macOS 图标已准备"
else
    echo "⚠️  缺少 macOS 图标 (assets/icon.icns)"
    echo "   Windows 用户请访问: https://cloudconvert.com/ico-to-icns"
fi
echo ""

# 检查依赖
echo "检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  未安装依赖"
    echo "正在安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi
echo ""

# 显示可用的构建命令
echo "======================================"
echo "  可用的构建命令"
echo "======================================"
echo ""
echo "Windows NSIS 安装程序:"
echo "  npm run build:nsis          # 标准版"
echo "  npm run build:nsis-setup    # 智能安装版"
echo ""
echo "macOS DMG 安装程序:"
echo "  npm run build:mac           # 标准版 (需要 macOS)"
echo "  npm run build:mac-setup     # 智能安装版 (需要 macOS)"
echo ""
echo "全平台构建:"
echo "  npm run build:all           # 标准版 (Windows + macOS)"
echo "  npm run build:all-setup     # 智能安装版 (Windows + macOS)"
echo ""
echo "======================================"
echo ""

# 询问是否构建
read -p "是否现在构建 Windows NSIS 安装程序? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "开始构建 Windows NSIS 安装程序..."
    echo "======================================"
    npm run build:nsis

    echo ""
    echo "======================================"
    echo "构建完成！"
    echo "======================================"
    echo ""
    echo "输出文件位置:"
    echo "  ../dist-installer/DeepSeekHarness-Installer-1.0.0.exe"
    echo ""
fi

echo "✅ 测试完成！"
