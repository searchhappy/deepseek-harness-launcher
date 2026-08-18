# 📦 安装程序构建指南

本指南介绍如何为 Windows 和 macOS 构建安装程序。

---

## 🪟 Windows NSIS 安装程序

### 前提条件

- Node.js (v16+)
- npm 或 yarn
- Windows 10/11（推荐用于构建 Windows 安装程序）

### 构建步骤

#### 1. 安装依赖

```bash
cd main
npm install
```

#### 2. 构建标准版 NSIS 安装程序

```bash
npm run build:nsis
```

生成文件：`../dist-installer/DeepSeekHarness-Installer-1.0.0.exe`

#### 3. 构建智能安装版 NSIS 安装程序

```bash
npm run build:nsis-setup
```

生成文件：`../dist-setup-installer/DeepSeekHarness-Setup-Installer-1.0.0.exe`

### NSIS 安装程序特性

- ✅ 可选择安装目录
- ✅ 创建桌面快捷方式
- ✅ 创建开始菜单快捷方式
- ✅ 支持卸载程序
- ✅ 显示许可协议
- ✅ 自定义安装图标

---

## 🍎 macOS 安装程序

### 前提条件

- Node.js (v16+)
- npm 或 yarn
- macOS 系统（推荐用于构建 macOS 安装程序）
- 已创建 `.icns` 格式的图标文件

### 准备 macOS 图标

#### 方法一：使用在线工具转换

1. 访问 https://cloudconvert.com/ico-to-icns
2. 上传 `assets/icon.ico` 文件
3. 转换为 `.icns` 格式
4. 下载并保存为 `assets/icon.icns`

#### 方法二：在 macOS 上使用命令行

1. 首先安装 ImageMagick：

```bash
brew install imagemagick
```

2. 创建不同尺寸的 PNG 图片：

```bash
# 从 .ico 提取图片
convert icon.ico icon.png

# 创建 iconset 文件夹
mkdir icon.iconset

# 生成各种尺寸
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

# 转换为 .icns
iconutil -c icns icon.iconset -o icon.icns
```

3. 将生成的 `icon.icns` 移动到 `assets/` 文件夹

#### 方法三：使用 Node.js 工具

```bash
npm install -g png2icons

# 提取 ico 中的最大尺寸图片，然后转换
png2icons icon.png -icns -o icon.icns
```

### 构建步骤

#### 1. 确保已创建 macOS 图标

检查 `assets/icon.icns` 文件是否存在。

#### 2. 构建标准版 macOS 安装程序

```bash
npm run build:mac
```

生成文件：`../dist-installer/DeepSeek Harness Launcher-1.0.0-x64.dmg` 和 `DeepSeek Harness Launcher-1.0.0-arm64.dmg`

#### 3. 构建智能安装版 macOS 安装程序

```bash
npm run build:mac-setup
```

生成文件：`../dist-setup-installer/DeepSeek Harness Setup-1.0.0-x64.dmg` 和 `DeepSeek Harness Setup-1.0.0-arm64.dmg`

### macOS DMG 特性

- ✅ 美观的拖放安装界面
- ✅ 支持 Intel (x64) 和 Apple Silicon (arm64)
- ✅ 包含"应用程序"文件夹快捷方式
- ✅ 自定义窗口大小和图标位置

---

## 🚀 一次性构建所有平台

### 构建标准版（Windows + macOS）

```bash
npm run build:all
```

### 构建智能安装版（Windows + macOS）

```bash
npm run build:all-setup
```

**注意**：在 Windows 上构建 macOS 安装程序可能会遇到限制，建议在对应平台上构建。

---

## 📁 输出文件位置

### 标准版
- Windows: `../dist-installer/DeepSeekHarness-Installer-1.0.0.exe`
- macOS (Intel): `../dist-installer/DeepSeek Harness Launcher-1.0.0-x64.dmg`
- macOS (Apple Silicon): `../dist-installer/DeepSeek Harness Launcher-1.0.0-arm64.dmg`

### 智能安装版
- Windows: `../dist-setup-installer/DeepSeekHarness-Setup-Installer-1.0.0.exe`
- macOS (Intel): `../dist-setup-installer/DeepSeek Harness Setup-1.0.0-x64.dmg`
- macOS (Apple Silicon): `../dist-setup-installer/DeepSeek Harness Setup-1.0.0-arm64.dmg`

---

## 🔧 配置文件说明

### `electron-builder-nsis.json`
标准版的 NSIS + DMG 安装程序配置

### `electron-builder-installer-setup.json`
智能安装版的 NSIS + DMG 安装程序配置

### 主要区别

| 特性 | Portable (旧) | NSIS (新) |
|------|--------------|-----------|
| 安装方式 | 直接运行 | 需要安装到系统 |
| 快捷方式 | 手动创建 | 自动创建 |
| 卸载程序 | 无 | 有 |
| 开始菜单 | 无 | 有 |
| 系统集成 | 低 | 高 |

---

## ⚠️ 常见问题

### Q: 构建 macOS 安装程序时提示缺少 icon.icns

**A**: 你需要先创建 macOS 图标文件。请参考上面的"准备 macOS 图标"部分。

### Q: 在 Windows 上能构建 macOS 安装程序吗？

**A**: electron-builder 在 Windows 上构建 macOS DMG 有一定限制，建议在 macOS 系统上构建 macOS 安装程序，或使用 CI/CD 服务（如 GitHub Actions）进行跨平台构建。

### Q: NSIS 安装程序需要管理员权限吗？

**A**: 配置中设置了 `allowElevation: true`，安装程序会在需要时请求管理员权限，但也允许用户安装到用户目录。

### Q: 如何修改安装程序的外观？

**A**: 编辑 `electron-builder-nsis.json` 或 `electron-builder-installer-setup.json` 文件中的 `nsis` 和 `dmg` 配置项。

---

## 📝 自定义配置

### 修改产品名称

在配置文件中修改 `productName` 字段。

### 修改 App ID

在配置文件中修改 `appId` 字段。

### 添加更多安装选项

参考 electron-builder 文档：https://www.electron.build/configuration/nsis

---

## 🌐 跨平台构建（使用 CI/CD）

### 使用 GitHub Actions

创建 `.github/workflows/build.yml`:

```yaml
name: Build Installers

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest]
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd main
          npm install
      
      - name: Build for Windows
        if: matrix.os == 'windows-latest'
        run: |
          cd main
          npm run build:nsis
          npm run build:nsis-setup
      
      - name: Build for macOS
        if: matrix.os == 'macos-latest'
        run: |
          cd main
          npm run build:mac
          npm run build:mac-setup
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: installers-${{ matrix.os }}
          path: |
            dist-installer/
            dist-setup-installer/
```

---

## ✅ 测试安装程序

### Windows

1. 运行生成的 `.exe` 文件
2. 按照安装向导完成安装
3. 检查桌面和开始菜单是否创建了快捷方式
4. 运行应用程序确认功能正常
5. 在控制面板中卸载程序

### macOS

1. 打开生成的 `.dmg` 文件
2. 将应用拖到"应用程序"文件夹
3. 从启动台或应用程序文件夹运行
4. 确认功能正常
5. 拖到废纸篓卸载

---

## 📮 发布到 GitHub Releases

构建完成后，你可以将安装程序上传到 GitHub Releases：

```bash
# 使用 GitHub CLI
gh release create v1.0.0 \
  ../dist-installer/*.exe \
  ../dist-installer/*.dmg \
  ../dist-setup-installer/*.exe \
  ../dist-setup-installer/*.dmg \
  --title "v1.0.0 Release" \
  --notes "Release notes here"
```

---

## 🎉 完成！

现在你已经成功创建了 Windows 和 macOS 的安装程序！
