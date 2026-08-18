# 安装程序配置说明

## 📦 新增文件

### 1. 配置文件（main 目录）
- `electron-builder-nsis.json` - 标准版 NSIS 安装程序配置
- `electron-builder-installer-setup.json` - 智能安装版 NSIS 安装程序配置

### 2. 文档（main 目录）
- `INSTALLER-BUILD-GUIDE.md` - 详细的构建指南（英文）
- `create-mac-icon-windows.md` - Windows 用户创建 macOS 图标的指南
- `test-build.sh` - 构建测试脚本

### 3. 脚本（main 目录）
- `create-mac-icon.sh` - macOS 图标自动创建脚本（需在 macOS 上运行）

### 4. CI/CD
- `.github/workflows/build-installers.yml` - GitHub Actions 自动构建工作流

### 5. 文档（根目录）
- `QUICK-START.md` - 快速开始指南
- `INSTALLER-SUMMARY.md` - 配置总结文档
- `README-INSTALLERS.md` - 本文件

---

## 🚀 快速开始

### Windows NSIS 安装程序（立即可用）

```bash
cd main
npm install
npm run build:nsis        # 标准版
npm run build:nsis-setup  # 智能安装版
```

**输出文件**：
- `dist-installer/DeepSeekHarness-Installer-1.0.0.exe`
- `dist-setup-installer/DeepSeekHarness-Setup-Installer-1.0.0.exe`

### macOS DMG 安装程序（需要准备图标）

**第 1 步：创建 macOS 图标**

访问 https://cloudconvert.com/ico-to-icns
1. 上传 `main/assets/icon.ico`
2. 转换为 ICNS 格式
3. 下载并保存为 `main/assets/icon.icns`

**第 2 步：构建（需要在 macOS 上运行）**

```bash
cd main
npm install
npm run build:mac        # 标准版
npm run build:mac-setup  # 智能安装版
```

---

## 🤖 自动化构建（推荐）

使用 GitHub Actions 自动构建 Windows 和 macOS 安装程序：

```bash
# 1. 提交代码
git add .
git commit -m "Add installer configurations"
git push

# 2. 创建版本标签
git tag v1.0.0
git push origin v1.0.0

# 3. GitHub Actions 会自动：
#    - 构建 Windows NSIS 安装程序
#    - 构建 macOS DMG 安装程序（Intel + Apple Silicon）
#    - 自动创建 macOS 图标
#    - 创建 GitHub Release
#    - 上传所有安装程序
```

---

## 📋 构建命令参考

| 命令 | 说明 | 平台要求 |
|------|------|----------|
| `npm run build:nsis` | 标准版 Windows NSIS | Windows |
| `npm run build:nsis-setup` | 智能安装版 Windows NSIS | Windows |
| `npm run build:mac` | 标准版 macOS DMG | macOS |
| `npm run build:mac-setup` | 智能安装版 macOS DMG | macOS |
| `npm run build:all` | 所有平台标准版 | Windows + macOS |
| `npm run build:all-setup` | 所有平台智能安装版 | Windows + macOS |

---

## 🎯 安装程序特性

### Windows NSIS 安装程序
- ✅ 专业的安装向导界面
- ✅ 用户可选择安装目录
- ✅ 自动创建桌面快捷方式
- ✅ 自动创建开始菜单项
- ✅ 完整的卸载程序（在控制面板中）
- ✅ 显示 MIT 许可协议
- ✅ 支持静默安装

### macOS DMG 安装程序
- ✅ 美观的拖放安装界面
- ✅ 支持 Intel (x64) 架构
- ✅ 支持 Apple Silicon (arm64) 架构
- ✅ 包含应用程序文件夹快捷方式
- ✅ 自定义窗口大小和图标位置

---

## 📁 输出目录结构

```
Deepseek/
├── main/                          # 源代码目录
│   ├── assets/
│   │   ├── icon.ico              # Windows 图标（已有）
│   │   └── icon.icns             # macOS 图标（需要创建）
│   ├── electron-builder-nsis.json
│   ├── electron-builder-installer-setup.json
│   └── package.json
├── dist-installer/                # 标准版输出
│   ├── DeepSeekHarness-Installer-1.0.0.exe
│   ├── DeepSeek Harness Launcher-1.0.0-x64.dmg
│   └── DeepSeek Harness Launcher-1.0.0-arm64.dmg
└── dist-setup-installer/          # 智能安装版输出
    ├── DeepSeekHarness-Setup-Installer-1.0.0.exe
    ├── DeepSeek Harness Setup-1.0.0-x64.dmg
    └── DeepSeek Harness Setup-1.0.0-arm64.dmg
```

---

## ⚠️ 重要注意事项

### 1. macOS 图标必须准备

构建 macOS 安装程序前，**必须**先创建 `main/assets/icon.icns` 文件。

**Windows 用户推荐方法**：
- 使用在线工具 https://cloudconvert.com/ico-to-icns

**macOS 用户**：
- 运行 `main/create-mac-icon.sh` 脚本

### 2. 跨平台构建限制

在 Windows 上构建 macOS DMG 有限制，推荐使用：
- ✅ GitHub Actions（自动化，推荐）
- ✅ 在 macOS 电脑上构建
- ❌ 不推荐在 Windows 上直接构建 macOS 安装程序

### 3. Node.js 版本要求

- 最低要求：Node.js v16.0.0
- 推荐版本：Node.js v18.x 或 v20.x

---

## 🧪 测试建议

### 运行测试脚本

```bash
cd main
./test-build.sh
```

这个脚本会：
- ✅ 检查环境配置
- ✅ 验证必需文件
- ✅ 检查依赖安装
- ✅ 显示可用命令
- ✅ 可选：立即构建 Windows 安装程序

### 手动测试

**Windows**：
1. 运行生成的 `.exe` 安装程序
2. 选择安装目录
3. 完成安装
4. 验证快捷方式
5. 启动应用测试功能
6. 从控制面板卸载

**macOS**：
1. 打开 `.dmg` 文件
2. 拖动到应用程序文件夹
3. 从启动台启动
4. 测试功能
5. 删除测试

---

## 📚 详细文档

- **完整构建指南**：`main/INSTALLER-BUILD-GUIDE.md`
- **快速开始**：`QUICK-START.md`
- **配置总结**：`INSTALLER-SUMMARY.md`
- **创建 macOS 图标**：`main/create-mac-icon-windows.md`

---

## 🔧 自定义配置

### 修改产品名称

编辑 `main/electron-builder-nsis.json`：

```json
{
  "productName": "你的产品名称"
}
```

### 修改版本号

编辑 `main/package.json`：

```json
{
  "version": "1.0.1"
}
```

### 添加代码签名（推荐）

```json
{
  "win": {
    "certificateFile": "path/to/certificate.p12",
    "certificatePassword": "${env.CERTIFICATE_PASSWORD}"
  }
}
```

---

## 💡 常见问题

### Q: 为什么需要两种安装程序（标准版和智能安装版）？

**A**: 
- **标准版**：直接启动应用，适合已有 Node.js 环境的开发者
- **智能安装版**：首先检查环境，引导安装依赖，适合新手用户

### Q: 在 Windows 上能构建 macOS 安装程序吗？

**A**: 有限制。推荐使用 GitHub Actions 自动构建，它会在真实的 macOS 环境中构建。

### Q: 如何更新安装程序图标？

**A**: 
- Windows：替换 `main/assets/icon.ico`
- macOS：替换 `main/assets/icon.icns`

### Q: GitHub Actions 构建需要付费吗？

**A**: 
- 公共仓库：完全免费
- 私有仓库：每月有免费额度，通常足够使用

---

## 📞 获取帮助

如果遇到问题：

1. 查看详细文档（`main/INSTALLER-BUILD-GUIDE.md`）
2. 运行测试脚本（`main/test-build.sh`）
3. 检查 GitHub Actions 日志
4. 参考 electron-builder 官方文档：https://www.electron.build/

---

## ✅ 下一步行动

1. **立即构建 Windows 安装程序**：
   ```bash
   cd main
   npm install
   npm run build:nsis
   ```

2. **准备 macOS 图标**：
   访问 https://cloudconvert.com/ico-to-icns

3. **设置自动化构建**：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

---

**🎉 配置完成！祝你构建顺利！**
