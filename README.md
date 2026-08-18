# 🚀 DeepSeek Harness Desktop Launcher

<div align="center">

一个功能完整的桌面应用，用于启动和管理 DeepSeek Harness 服务

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-28.3.3-blue.svg)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows-brightgreen.svg)](https://github.com)

[下载最新版本](https://github.com/searchhappy/deepseek-harness-launcher/releases) | [查看文档](https://github.com/searchhappy/deepseek-harness-launcher) | [反馈问题](https://github.com/searchhappy/deepseek-harness-launcher/issues)

</div>

---

## ✨ 功能特点

- 🎨 **现代化界面** - 紫色渐变设计，美观易用
- 🖥️ **双显示模式** - 应用内窗口 + 浏览器模式
- 🔧 **智能端口管理** - 自动检测并清理端口占用
- 📊 **实时日志** - 查看服务运行的所有输出
- ⚡ **一键操作** - 启动、停止、清除日志等快捷功能
- 🎯 **智能引导** - 安装版自动检测环境并引导安装

---

## 📦 两个版本

### 标准便携版 (推荐给开发者)

**文件**: `DeepSeekHarness-Portable.exe` (113MB)

**功能**:
- ▶️ 启动/停止服务
- 🔧 清除端口占用
- 🗑️ 清除日志
- 🖥️ 应用内窗口模式
- 🌐 浏览器模式
- 📊 实时日志显示

**要求**: 需要预装 [Node.js](https://nodejs.org/) (v16+)

**适合**: 开发者、技术人员、已有 Node.js 环境的用户

---

### 智能安装版 (推荐给新手)

**文件**: `DeepSeekHarness-Installer.exe` (113MB)

**功能**:
- ✅ 自动检测 Node.js
- 📥 引导安装依赖
- 🎓 一步步指导
- 🔗 提供下载链接
- ✨ 完成后自动启动

**要求**: 无（会引导你安装所需环境）

**适合**: 完全小白、第一次使用、零基础用户

---

## 📥 下载安装

### 方式一：下载预编译版本

前往 [Releases](https://github.com/searchhappy/deepseek-harness-launcher/releases) 页面下载最新版本：

- 📦 **技术人员**: 下载 `DeepSeekHarness-Portable.exe`
- 🎓 **普通用户**: 下载 `DeepSeekHarness-Installer.exe`

### 方式二：从源码构建

```bash
# 克隆仓库
git clone https://github.com/searchhappy/deepseek-harness-launcher.git
cd deepseek-harness-launcher

# 安装依赖
npm install

# 构建两个版本
npm run build:win          # 标准版
npm run build:setup        # 安装版
```

---

## 🚀 使用方法

### 标准便携版

1. **下载并运行** `DeepSeekHarness-Portable.exe`
2. **点击"启动服务"** 按钮
3. **等待服务启动** 在日志窗口查看进度
4. **选择使用方式**:
   - 点击 **"在应用内打开"** - 在新窗口中使用
   - 点击 **"在浏览器中打开"** - 在浏览器中使用
5. **开始使用** DeepSeek Harness

### 智能安装版

1. **下载并运行** `DeepSeekHarness-Installer.exe`
2. **自动检测环境** 应用会检测 Node.js 是否已安装
3. **按提示操作**: 如果缺少依赖，点击提供的下载链接安装
4. **点击"启动"按钮** 完成后自动打开主应用
5. **开始使用**

---

## 💻 系统要求

### 运行要求

- **操作系统**: Windows 10/11 (64位)
- **Node.js**: v16.0.0 或更高版本
- **内存**: 至少 2GB RAM
- **磁盘空间**: 至少 200MB 可用空间

---

## ❓ 常见问题

### Q: 提示端口 3080 被占用怎么办？

**A**: 点击 **"清除端口占用"** 按钮，应用会自动清理该端口的所有进程。

### Q: 找不到 Node.js 怎么办？

**A**: 
- 使用智能安装版，它会引导你安装
- 或手动下载安装：https://nodejs.org/

### Q: 两个版本有什么区别？

**A**: 
- **标准版**: 直接显示控制台，适合已有环境的用户
- **安装版**: 显示安装向导，引导新用户配置环境

### Q: 关闭应用后服务还在运行吗？

**A**: 不会。关闭应用会自动停止后台 DeepSeek Harness 服务。

### Q: 如何报告问题？

**A**: 
- 访问：https://github.com/searchhappy/deepseek-harness-launcher/issues
- 点击 "New issue" 创建新问题（仓库创建后可用）
- 或通过 GitHub 主页联系：https://github.com/searchhappy

---

## 🔧 技术栈

- **框架**: [Electron](https://www.electronjs.org/) 28.3.3
- **语言**: JavaScript (Node.js)
- **构建工具**: electron-builder
- **DeepSeek Harness**: [@deepseek-ai/dsh](https://www.npmjs.com/package/@deepseek-ai/dsh)

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 如何贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 报告问题

如果遇到问题或有建议，请：
1. 在 [Issues](https://github.com/searchhappy/deepseek-harness-launcher/issues) 中搜索是否已有相关问题
2. 如果没有，创建新的 Issue 并详细描述问题
3. 包含复现步骤、错误日志、系统信息等

---

## 📝 更新日志

### v1.0.0 (2026-08-17)

- ✨ 首次发布
- ✅ 标准便携版
- ✅ 智能安装版
- ✅ 自动端口清理
- ✅ 双显示模式
- ✅ DeepSeek 官方图标

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 🙏 致谢

- [DeepSeek](https://www.deepseek.com/) - 提供强大的 AI 模型和 Harness 工具
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- 所有贡献者和用户

---

## 📮 联系方式

- **GitHub**: https://github.com/searchhappy
- **仓库**: https://github.com/searchhappy/deepseek-harness-launcher
- **问题反馈**: [GitHub Issues](https://github.com/searchhappy/deepseek-harness-launcher/issues) （仓库创建后可用）

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by [searchhappy](https://github.com/searchhappy)

</div>
