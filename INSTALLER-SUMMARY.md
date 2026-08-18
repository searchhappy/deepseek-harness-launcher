# 📦 安装程序配置总结

## ✅ 已创建的文件

### 配置文件
- ✅ `main/electron-builder-nsis.json` - 标准版 NSIS + DMG 配置
- ✅ `main/electron-builder-installer-setup.json` - 智能安装版 NSIS + DMG 配置
- ✅ `main/package.json` - 已更新构建脚本

### 文档
- ✅ `main/INSTALLER-BUILD-GUIDE.md` - 完整构建指南
- ✅ `main/create-mac-icon-windows.md` - Windows 上创建 macOS 图标指南
- ✅ `main/create-mac-icon.sh` - macOS 图标创建脚本
- ✅ `QUICK-START.md` - 快速开始指南

### 自动化
- ✅ `.github/workflows/build-installers.yml` - GitHub Actions 自动构建工作流

---

## 🎯 立即可用的功能

### Windows NSIS 安装程序 ✅

**立即可以构建**（无需额外配置）：

```bash
cd main
npm install
npm run build:nsis        # 标准版
npm run build:nsis-setup  # 智能安装版
```

**特性**：
- ✅ 专业的 NSIS 安装向导
- ✅ 用户可选择安装目录
- ✅ 自动创建桌面快捷方式
- ✅ 自动创建开始菜单项
- ✅ 包含卸载程序
- ✅ 显示 MIT 许可协议
- ✅ 支持静默安装

---

## 🍎 macOS DMG 安装程序

### 准备步骤

**1. 创建 macOS 图标（必须）**

在 Windows 上（推荐）：
```
1. 访问 https://cloudconvert.com/ico-to-icns
2. 上传 main/assets/icon.ico
3. 下载转换后的 icon.icns
4. 保存到 main/assets/icon.icns
```

**2. 构建 DMG（需要 macOS 系统）**

```bash
cd main
npm install
npm run build:mac        # 标准版
npm run build:mac-setup  # 智能安装版
```

**特性**：
- ✅ 美观的拖放安装界面
- ✅ 支持 Intel (x64) 和 Apple Silicon (arm64)
- ✅ 包含"应用程序"文件夹快捷方式
- ✅ 自定义窗口大小和布局

---

## 🤖 自动化构建（GitHub Actions）

### 无需 macOS 电脑的解决方案

**已配置完成**，只需：

```bash
# 推送代码
git add .
git commit -m "Add installer configurations"
git push

# 创建版本标签
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 会自动：
1. ✅ 在 Windows 虚拟机上构建 Windows 安装程序
2. ✅ 在 macOS 虚拟机上构建 macOS 安装程序
3. ✅ 自动创建 macOS 图标
4. ✅ 创建 GitHub Release
5. ✅ 上传所有安装程序文件

---

## 📦 可用的构建命令

| 命令 | 说明 | 平台要求 |
|------|------|----------|
| `npm run build:nsis` | 构建标准版 Windows NSIS | Windows |
| `npm run build:nsis-setup` | 构建智能安装版 Windows NSIS | Windows |
| `npm run build:mac` | 构建标准版 macOS DMG | macOS |
| `npm run build:mac-setup` | 构建智能安装版 macOS DMG | macOS |
| `npm run build:all` | 构建所有平台标准版 | 对应平台 |
| `npm run build:all-setup` | 构建所有平台智能安装版 | 对应平台 |

---

## 📁 输出目录

### 标准版
```
dist-installer/
├── DeepSeekHarness-Installer-1.0.0.exe          (Windows)
├── DeepSeek Harness Launcher-1.0.0-x64.dmg     (macOS Intel)
└── DeepSeek Harness Launcher-1.0.0-arm64.dmg   (macOS Apple Silicon)
```

### 智能安装版
```
dist-setup-installer/
├── DeepSeekHarness-Setup-Installer-1.0.0.exe              (Windows)
├── DeepSeek Harness Setup-1.0.0-x64.dmg                   (macOS Intel)
└── DeepSeek Harness Setup-1.0.0-arm64.dmg                 (macOS Apple Silicon)
```

---

## 🎯 推荐使用方式

### 场景 1: 只需要 Windows 安装程序

**在 Windows 上直接构建**：
```bash
cd main
npm install
npm run build:nsis
npm run build:nsis-setup
```
⏱️ 耗时：约 5-10 分钟

### 场景 2: 需要 Windows + macOS 安装程序

#### 选项 A: 使用 GitHub Actions（推荐 ⭐）
```bash
git tag v1.0.0
git push origin v1.0.0
```
⏱️ 耗时：约 10-15 分钟
💰 成本：免费（公共仓库）

#### 选项 B: 分别在各平台构建
1. 在 Windows 上构建 Windows 安装程序
2. 在 macOS 上构建 macOS 安装程序
3. 手动整合发布

⏱️ 耗时：约 10-20 分钟
📝 要求：需要访问两种操作系统

---

## 🔧 配置差异说明

### 便携版 vs NSIS 安装程序

| 特性 | 便携版 (Portable) | NSIS 安装程序 |
|------|-------------------|---------------|
| 文件类型 | .exe | .exe 安装包 |
| 安装过程 | 无需安装，直接运行 | 需要安装到系统 |
| 快捷方式 | 手动创建 | 自动创建 |
| 开始菜单 | ❌ | ✅ |
| 卸载程序 | ❌ | ✅ 在控制面板中 |
| 系统集成 | 低 | 高 |
| 用户体验 | 技术用户 | 普通用户 |

### 标准版 vs 智能安装版

| 特性 | 标准版 | 智能安装版 |
|------|--------|------------|
| 主入口 | main.js | setup-main.js |
| 启动界面 | 直接控制台 | 安装向导 |
| 环境检测 | ❌ | ✅ |
| Node.js 引导 | ❌ | ✅ |
| 适合用户 | 开发者 | 新手 |

---

## ⚙️ 配置文件详解

### electron-builder-nsis.json（标准版）

```json
{
  "appId": "com.deepseek.harness.launcher",
  "productName": "DeepSeek Harness Launcher",
  "win": {
    "target": [{"target": "nsis", "arch": ["x64"]}],
    "icon": "assets/icon.ico"
  },
  "nsis": {
    "oneClick": false,                           // 允许自定义安装
    "allowToChangeInstallationDirectory": true,  // 可选择目录
    "createDesktopShortcut": true,              // 桌面快捷方式
    "createStartMenuShortcut": true             // 开始菜单
  }
}
```

### electron-builder-installer-setup.json（智能安装版）

```json
{
  "appId": "com.deepseek.harness.installer",
  "productName": "DeepSeek Harness Setup",
  "extraMetadata": {
    "main": "setup-main.js"  // 使用安装向导入口
  }
}
```

---

## 🧪 测试建议

### Windows 测试清单
```bash
# 1. 构建
cd main
npm run build:nsis

# 2. 安装测试
# - 运行生成的 .exe
# - 选择不同安装目录
# - 验证快捷方式创建
# - 启动应用测试功能
# - 从控制面板卸载
```

### macOS 测试清单
```bash
# 1. 构建（在 macOS 上）
cd main
npm run build:mac

# 2. 安装测试
# - 打开 .dmg 文件
# - 拖到应用程序文件夹
# - 从 Launchpad 启动
# - 测试功能
# - 拖到废纸篓卸载
```

---

## 📈 版本发布流程

### 1. 更新版本号
```bash
cd main
# 编辑 package.json，修改 version 字段
# 例如：从 "1.0.0" 改为 "1.0.1"
```

### 2. 提交更改
```bash
git add .
git commit -m "Release v1.0.1"
git push
```

### 3. 创建标签
```bash
git tag v1.0.1
git push origin v1.0.1
```

### 4. 等待构建
- 访问 GitHub Actions 查看进度
- 约 10-15 分钟后完成

### 5. 发布
- 在 Releases 页面查看自动创建的发布
- 编辑发布说明
- 公开发布

---

## 💡 高级技巧

### 自定义安装程序外观

编辑 `electron-builder-nsis.json`：

```json
"nsis": {
  "installerIcon": "assets/custom-installer-icon.ico",
  "installerHeader": "assets/header.bmp",
  "installerSidebar": "assets/sidebar.bmp"
}
```

### 添加额外文件到安装包

```json
"extraFiles": [
  {
    "from": "path/to/files",
    "to": "destination",
    "filter": ["**/*"]
  }
]
```

### 代码签名（推荐用于生产环境）

```json
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "${env.CERTIFICATE_PASSWORD}"
}
```

---

## 🎓 学习资源

- electron-builder 官方文档: https://www.electron.build/
- NSIS 配置: https://www.electron.build/configuration/nsis
- macOS DMG 配置: https://www.electron.build/configuration/dmg
- GitHub Actions: https://docs.github.com/en/actions

---

## ✨ 下一步

现在你可以：

1. **立即构建 Windows 安装程序**
   ```bash
   cd main
   npm install
   npm run build:nsis
   ```

2. **准备 macOS 图标**
   - 访问 https://cloudconvert.com/ico-to-icns
   - 转换 icon.ico 为 icon.icns

3. **设置自动化构建**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

---

**🎉 所有配置已完成，祝你构建顺利！**
