# 🚀 快速开始 - 创建安装程序

本文档提供最快速的安装程序构建方法。

---

## 📋 目录

- [Windows NSIS 安装程序](#windows-nsis-安装程序)
- [macOS DMG 安装程序](#macos-dmg-安装程序)
- [自动化构建（推荐）](#自动化构建推荐)

---

## 🪟 Windows NSIS 安装程序

### 立即构建

```bash
cd main
npm install
npm run build:nsis        # 标准版
npm run build:nsis-setup  # 智能安装版
```

### 输出文件

- `../dist-installer/DeepSeekHarness-Installer-1.0.0.exe`
- `../dist-setup-installer/DeepSeekHarness-Setup-Installer-1.0.0.exe`

### ✅ 完成！

Windows 安装程序已就绪，无需额外配置。

---

## 🍎 macOS DMG 安装程序

### 第一步：创建 macOS 图标

**在 Windows 上（你的当前系统）**：

1. 访问 https://cloudconvert.com/ico-to-icns
2. 上传 `main/assets/icon.ico`
3. 转换并下载 `icon.icns`
4. 保存到 `main/assets/icon.icns`

**或在 macOS 上**：

```bash
cd main
chmod +x create-mac-icon.sh
./create-mac-icon.sh
```

### 第二步：构建 DMG

**必须在 macOS 系统上运行**：

```bash
cd main
npm install
npm run build:mac        # 标准版
npm run build:mac-setup  # 智能安装版
```

### 输出文件

- `../dist-installer/DeepSeek Harness Launcher-1.0.0-x64.dmg` (Intel)
- `../dist-installer/DeepSeek Harness Launcher-1.0.0-arm64.dmg` (Apple Silicon)
- `../dist-setup-installer/DeepSeek Harness Setup-1.0.0-x64.dmg` (Intel)
- `../dist-setup-installer/DeepSeek Harness Setup-1.0.0-arm64.dmg` (Apple Silicon)

---

## 🤖 自动化构建（推荐）

### 使用 GitHub Actions（无需 macOS 电脑）

#### 第一步：上传代码到 GitHub

```bash
# 如果还没有推送到 GitHub
git add .
git commit -m "Add installer configurations"
git push origin master
```

#### 第二步：创建 Release

**方法一：使用 Git 标签**

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 会自动：
- ✅ 构建 Windows NSIS 安装程序
- ✅ 构建 macOS DMG 安装程序（Intel 和 Apple Silicon）
- ✅ 创建 GitHub Release
- ✅ 上传所有安装程序

**方法二：手动触发**

1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Build Installers" 工作流
4. 点击 "Run workflow"
5. 输入版本号（如 1.0.0）
6. 点击 "Run workflow"

#### 第三步：下载安装程序

1. 等待构建完成（约 10-15 分钟）
2. 访问 "Actions" 标签查看进度
3. 构建完成后，在 "Releases" 页面下载安装程序

或直接从 "Artifacts" 下载（如果使用手动触发）。

---

## 📦 构建脚本总览

| 命令 | 平台 | 类型 | 输出 |
|------|------|------|------|
| `npm run build:nsis` | Windows | 标准版 NSIS | dist-installer/ |
| `npm run build:nsis-setup` | Windows | 智能安装版 NSIS | dist-setup-installer/ |
| `npm run build:mac` | macOS | 标准版 DMG | dist-installer/ |
| `npm run build:mac-setup` | macOS | 智能安装版 DMG | dist-setup-installer/ |
| `npm run build:all` | 两者 | 标准版 (NSIS + DMG) | dist-installer/ |
| `npm run build:all-setup` | 两者 | 智能安装版 (NSIS + DMG) | dist-setup-installer/ |

---

## ⚠️ 重要说明

### Windows 用户构建 macOS 应用

在 Windows 上直接运行 `npm run build:mac` 可能会失败，因为 electron-builder 在 Windows 上构建 macOS DMG 有限制。

**推荐方案**：
1. **使用 GitHub Actions**（最简单，无需 macOS 电脑）
2. 在 macOS 电脑上构建
3. 使用云端 CI/CD 服务（如 CircleCI, Travis CI）

### macOS 图标必须准备

构建 macOS 安装程序前，必须先创建 `assets/icon.icns` 文件。

---

## 🎯 推荐工作流

### 仅需 Windows 安装程序

```bash
cd main
npm install
npm run build:nsis
npm run build:nsis-setup
```

**完成！** 在 `../dist-installer/` 和 `../dist-setup-installer/` 找到安装程序。

### 需要 Windows + macOS 安装程序

**使用 GitHub Actions（推荐）**：

```bash
# 1. 提交所有更改
git add .
git commit -m "Add installer configurations"
git push

# 2. 创建标签触发构建
git tag v1.0.0
git push origin v1.0.0

# 3. 等待 GitHub Actions 完成
# 4. 从 Releases 页面下载所有安装程序
```

---

## 📖 详细文档

- 完整构建指南：查看 `INSTALLER-BUILD-GUIDE.md`
- Windows 图标转换：查看 `create-mac-icon-windows.md`
- macOS 图标脚本：运行 `create-mac-icon.sh`

---

## 🔍 故障排除

### Windows: 构建失败

```bash
# 清理并重新安装
cd main
rm -rf node_modules
npm install
npm run build:nsis
```

### macOS: 缺少 icon.icns

参考 `create-mac-icon-windows.md` 中的方法创建图标文件。

### GitHub Actions: 构建失败

1. 检查 Actions 标签中的错误日志
2. 确保所有文件已提交到仓库
3. 确认 `package.json` 配置正确

---

## ✅ 测试清单

### Windows 安装程序测试

- [ ] 安装程序可以正常运行
- [ ] 可以选择安装目录
- [ ] 创建了桌面快捷方式
- [ ] 创建了开始菜单项
- [ ] 应用程序可以正常启动
- [ ] 可以通过控制面板卸载

### macOS 安装程序测试

- [ ] DMG 文件可以正常打开
- [ ] 拖放安装界面显示正常
- [ ] 可以拖到应用程序文件夹
- [ ] 应用程序可以正常启动
- [ ] 图标显示正确
- [ ] 可以从应用程序文件夹卸载

---

## 🎉 发布到用户

### 选项 1: GitHub Releases（推荐）

使用 GitHub Actions 自动发布，用户可以从 Releases 页面下载。

### 选项 2: 直接分发

将构建的安装程序文件上传到：
- 你的网站
- 网盘（如 Google Drive, OneDrive）
- 其他文件托管服务

### 选项 3: 企业分发

如果是企业内部使用：
- 部署到内部软件仓库
- 通过 MDM（移动设备管理）系统分发
- 使用 Intune, SCCM 等企业工具

---

## 💡 提示

1. **版本号管理**：修改 `main/package.json` 中的 `version` 字段来更新版本号
2. **产品名称**：在配置文件中修改 `productName` 字段
3. **图标更新**：替换 `assets/icon.ico` 和 `assets/icon.icns` 文件
4. **许可协议**：NSIS 安装程序会显示 `LICENSE` 文件内容

---

## 📞 需要帮助？

- 详细文档：`INSTALLER-BUILD-GUIDE.md`
- 图标转换：`create-mac-icon-windows.md`
- GitHub Actions：`.github/workflows/build-installers.yml`

---

**祝构建顺利！🎉**
