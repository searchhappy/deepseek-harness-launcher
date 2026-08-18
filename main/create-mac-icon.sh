#!/bin/bash

# macOS 图标创建脚本
# 使用方法: ./create-mac-icon.sh

echo "🍎 macOS 图标创建工具"
echo "====================="

# 检查是否在 macOS 上运行
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ 此脚本需要在 macOS 上运行"
    echo ""
    echo "💡 Windows 用户请使用以下替代方法："
    echo "   1. 在线转换: https://cloudconvert.com/ico-to-icns"
    echo "   2. 上传 assets/icon.ico"
    echo "   3. 下载转换后的 icon.icns 保存到 assets/ 文件夹"
    exit 1
fi

# 检查 ImageMagick 是否安装
if ! command -v convert &> /dev/null; then
    echo "❌ 未找到 ImageMagick"
    echo "📦 正在安装 ImageMagick..."

    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "❌ 未找到 Homebrew"
        echo "请先安装 Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
fi

# 检查 sips 命令（macOS 自带）
if ! command -v sips &> /dev/null; then
    echo "❌ 未找到 sips 命令（应该是 macOS 自带的）"
    exit 1
fi

# 检查源文件
ICO_FILE="assets/icon.ico"
if [ ! -f "$ICO_FILE" ]; then
    echo "❌ 未找到 $ICO_FILE"
    exit 1
fi

echo "✅ 找到源文件: $ICO_FILE"
echo ""

# 创建临时目录
TEMP_DIR="temp_icon_conversion"
mkdir -p "$TEMP_DIR"

# 从 ICO 提取 PNG
echo "📸 从 ICO 提取图片..."
convert "$ICO_FILE" "$TEMP_DIR/icon.png"

# 选择最大的图片（如果有多个）
if [ -f "$TEMP_DIR/icon-0.png" ]; then
    mv "$TEMP_DIR/icon-0.png" "$TEMP_DIR/icon.png"
fi

# 创建 iconset 目录
ICONSET="$TEMP_DIR/icon.iconset"
mkdir -p "$ICONSET"

echo "🎨 生成各种尺寸的图标..."

# 生成所有需要的尺寸
sips -z 16 16     "$TEMP_DIR/icon.png" --out "$ICONSET/icon_16x16.png" > /dev/null 2>&1
sips -z 32 32     "$TEMP_DIR/icon.png" --out "$ICONSET/icon_16x16@2x.png" > /dev/null 2>&1
sips -z 32 32     "$TEMP_DIR/icon.png" --out "$ICONSET/icon_32x32.png" > /dev/null 2>&1
sips -z 64 64     "$TEMP_DIR/icon.png" --out "$ICONSET/icon_32x32@2x.png" > /dev/null 2>&1
sips -z 128 128   "$TEMP_DIR/icon.png" --out "$ICONSET/icon_128x128.png" > /dev/null 2>&1
sips -z 256 256   "$TEMP_DIR/icon.png" --out "$ICONSET/icon_128x128@2x.png" > /dev/null 2>&1
sips -z 256 256   "$TEMP_DIR/icon.png" --out "$ICONSET/icon_256x256.png" > /dev/null 2>&1
sips -z 512 512   "$TEMP_DIR/icon.png" --out "$ICONSET/icon_256x256@2x.png" > /dev/null 2>&1
sips -z 512 512   "$TEMP_DIR/icon.png" --out "$ICONSET/icon_512x512.png" > /dev/null 2>&1
sips -z 1024 1024 "$TEMP_DIR/icon.png" --out "$ICONSET/icon_512x512@2x.png" > /dev/null 2>&1

echo "🔨 转换为 .icns 格式..."

# 转换为 icns
iconutil -c icns "$ICONSET" -o "$TEMP_DIR/icon.icns"

# 移动到 assets 目录
mv "$TEMP_DIR/icon.icns" "assets/icon.icns"

# 清理临时文件
rm -rf "$TEMP_DIR"

echo ""
echo "✅ 成功创建 macOS 图标！"
echo "📁 图标位置: assets/icon.icns"
echo ""
echo "🚀 现在你可以运行以下命令构建 macOS 安装程序："
echo "   npm run build:mac"
echo "   npm run build:mac-setup"
echo ""
