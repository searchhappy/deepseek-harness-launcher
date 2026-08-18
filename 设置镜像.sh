# 国内镜像加速配置

# 设置 npm 淘宝镜像
npm config set registry https://registry.npmmirror.com

# 设置 Electron 镜像
npm config set electron_mirror https://npmmirror.com/mirrors/electron/

# 设置 Electron Builder 镜像
npm config set electron_builder_binaries_mirror https://npmmirror.com/mirrors/electron-builder-binaries/

echo "镜像配置完成！"
