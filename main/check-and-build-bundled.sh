#!/bin/bash

echo "======================================"
echo "  开箱即用版本构建助手"
echo "======================================"
echo ""

cd "$(dirname "$0")"

# 检查 Node.js 便携版
if [ -f "runtime/node/node.exe" ]; then
    echo "✅ Node.js 便携版已准备好"
    NODE_VERSION=$(runtime/node/node.exe --version)
    echo "   版本: $NODE_VERSION"
else
    echo "❌ 未找到 Node.js 便携版"
    echo "   请先运行下载脚本"
    exit 1
fi

echo ""

# 检查 DeepSeek Harness
if [ -d "runtime/node_modules/@deepseek-ai/dsh" ]; then
    echo "✅ DeepSeek Harness 已安装"

    # 检查包大小
    SIZE=$(du -sh runtime/node_modules/@deepseek-ai/dsh | cut -f1)
    echo "   大小: $SIZE"

    echo ""
    echo "======================================"
    echo "  所有依赖已准备完成！"
    echo "======================================"
    echo ""
    echo "现在可以构建开箱即用版本："
    echo "  npm run build:bundled"
    echo ""

    read -p "是否立即构建？(y/n): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "开始构建开箱即用安装程序..."
        echo "======================================"
        npm run build:bundled

        echo ""
        echo "======================================"
        echo "✅ 构建完成！"
        echo "======================================"
        echo ""
        echo "输出文件："
        ls -lh ../dist-bundled/*.exe
    fi

else
    echo "⏳ DeepSeek Harness 正在安装中..."
    echo ""

    # 检查 npm 进程
    if ps aux | grep -v grep | grep npm.cmd > /dev/null; then
        echo "📦 npm 进程正在运行，请等待..."
        echo ""
        echo "你可以："
        echo "  1. 等待几分钟后再次运行此脚本"
        echo "  2. 或手动检查: ls runtime/node_modules/@deepseek-ai/"
    else
        echo "❌ npm 进程未运行，但依赖未安装"
        echo ""
        read -p "是否重新安装 DeepSeek Harness？(y/n): " -n 1 -r
        echo ""

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "开始安装 DeepSeek Harness..."
            cd runtime
            ./node/npm.cmd install @deepseek-ai/dsh
            echo ""
            echo "安装完成后，请重新运行此脚本"
        fi
    fi
fi

echo ""
echo "完成！"
