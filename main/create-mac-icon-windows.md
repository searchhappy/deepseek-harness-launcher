# 在 Windows 上创建 macOS 图标指南

由于你在 Windows 系统上，无法直接运行 macOS 的脚本工具。以下是几种在 Windows 上创建 `.icns` 文件的方法。

---

## 方法 1: 在线转换工具（推荐 ⭐）

### CloudConvert

1. 访问 https://cloudconvert.com/ico-to-icns
2. 点击 "Select File" 上传 `assets/icon.ico`
3. 确认转换格式为 ICNS
4. 点击 "Convert" 开始转换
5. 下载转换后的文件
6. 重命名为 `icon.icns` 并保存到 `assets/` 文件夹

### AnyConv

1. 访问 https://anyconv.com/ico-to-icns-converter/
2. 上传 `assets/icon.ico`
3. 点击转换
4. 下载并保存到 `assets/icon.icns`

---

## 方法 2: 使用 Node.js 工具

### 安装 png2icons

```bash
npm install -g png2icons
```

### 转换步骤

```bash
cd main/assets

# 首先需要一个 PNG 文件（如果你有的话）
# 如果只有 ico，先用在线工具转为 png

# 转换 PNG 为 ICNS
png2icons icon.png -icns -o icon.icns
```

**注意**: 这个工具需要先有高质量的 PNG 文件（建议 1024x1024）。

---

## 方法 3: 使用 iConvert Icons

这是一个 Windows 应用程序：

1. 下载 iConvert Icons: https://iconverticons.com/
2. 打开软件
3. 导入 `icon.ico` 文件
4. 选择输出格式为 `.icns`
5. 导出到 `assets/icon.icns`

---

## 方法 4: 使用 WSL (Windows Subsystem for Linux)

如果你安装了 WSL，可以在 Linux 环境中使用类似 macOS 的工具：

```bash
# 在 WSL 中
sudo apt-get update
sudo apt-get install imagemagick icnsutils

cd /mnt/c/Users/Administration/Desktop/Deepseek/main

# 转换 ico 到 png
convert assets/icon.ico temp_icon.png

# 创建 icns（简化版本）
png2icns assets/icon.icns temp_icon.png

# 清理
rm temp_icon.png
```

---

## 方法 5: 手动创建（使用 PowerShell + ImageMagick）

### 安装 ImageMagick for Windows

1. 下载: https://imagemagick.org/script/download.php#windows
2. 安装时勾选 "Install legacy utilities"

### 运行脚本

保存以下内容为 `create-icon.ps1`:

```powershell
# 检查 ImageMagick
if (!(Get-Command convert -ErrorAction SilentlyContinue)) {
    Write-Host "请先安装 ImageMagick: https://imagemagick.org/script/download.php#windows"
    exit
}

# 创建临时目录
$tempDir = "temp_icon"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# 转换 ico 到 png
Write-Host "转换图标..."
convert "assets/icon.ico" "$tempDir/icon.png"

# 创建不同尺寸
$sizes = @(16, 32, 64, 128, 256, 512, 1024)
foreach ($size in $sizes) {
    convert "$tempDir/icon.png" -resize "${size}x${size}" "$tempDir/icon_${size}.png"
}

Write-Host "✅ PNG 文件已创建"
Write-Host "⚠️  请使用在线工具将这些 PNG 文件转换为 ICNS 格式"
Write-Host "推荐: https://cloudconvert.com/png-to-icns"
```

运行：
```bash
powershell -ExecutionPolicy Bypass -File create-icon.ps1
```

---

## ✅ 验证图标文件

创建后，检查文件：

```bash
cd main
ls -lh assets/icon.icns
```

文件大小通常在 100KB - 500KB 之间。

---

## 🚀 下一步

创建好 `icon.icns` 后，你就可以构建 macOS 安装程序了：

```bash
cd main
npm run build:mac          # 标准版
npm run build:mac-setup    # 智能安装版
```

**注意**: 在 Windows 上构建 macOS DMG 可能会有限制，最好的方式是：
- 在 macOS 电脑上构建
- 或使用 GitHub Actions 等 CI/CD 服务进行跨平台构建

---

## 💡 推荐方案

**最简单的方法**：使用 CloudConvert 在线转换工具（方法 1）
- 无需安装软件
- 转换质量好
- 快速方便

**最自动化的方法**：设置 GitHub Actions 自动构建
- 一次配置，永久使用
- 支持多平台
- 可以在任何系统上触发构建
