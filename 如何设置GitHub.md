# 🔧 设置 GitHub 远程仓库指南

## 步骤 1：在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 仓库名称：`deepseek-harness-launcher` (或你喜欢的名称)
3. 选择 Public（公开）或 Private（私有）
4. **不要**勾选 "Add a README file"
5. 点击 "Create repository"

## 步骤 2：连接本地仓库到 GitHub

在你的项目目录运行：

```bash
cd C:\Users\Administration\Desktop\Deepseek

# 添加远程仓库（替换 YOUR-USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR-USERNAME/deepseek-harness-launcher.git

# 推送代码到 GitHub
git push -u origin master

# 如果主分支是 main 而不是 master，使用：
# git push -u origin main
```

## 步骤 3：推送标签触发自动构建

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签
git push origin v1.0.0
```

## 步骤 4：查看构建进度

1. 访问你的 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看 "Build Installers" 工作流
4. 等待构建完成（约 10-15 分钟）
5. 在 "Releases" 页面下载安装程序

---

## 🔐 使用 SSH（可选，更安全）

如果你已经设置了 SSH 密钥：

```bash
git remote add origin git@github.com:YOUR-USERNAME/deepseek-harness-launcher.git
git push -u origin master
git push origin v1.0.0
```

---

## ⚠️ 注意事项

### Private 仓库的 GitHub Actions

如果你创建的是私有仓库：
- 每月有免费的 Actions 分钟数（2000 分钟）
- 超出后需要付费

### Public 仓库的 GitHub Actions

如果你创建的是公开仓库：
- GitHub Actions 完全免费
- 无限制使用

---

## 🎯 推荐方案

### 如果你不想使用 GitHub

**直接在本地构建 Windows 安装程序**：

```bash
cd C:\Users\Administration\Desktop\Deepseek\main
npm install
npm run build:nsis
npm run build:nsis-setup
```

这样就可以得到 Windows 安装程序，不需要 GitHub。

### 如果你想要 macOS 安装程序

你需要：
1. 创建 GitHub 仓库（按上面步骤）
2. 使用 GitHub Actions 自动构建
3. 或者在 macOS 电脑上手动构建

---

## 📞 需要帮助？

如果你需要：
- ✅ 只要 Windows 安装程序 → 直接本地构建即可
- ✅ 需要 macOS 安装程序 → 需要设置 GitHub 或访问 macOS 电脑
