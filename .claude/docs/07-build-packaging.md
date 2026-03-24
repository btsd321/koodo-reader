# 构建与打包

## 开发命令

```bash
npm run dev      # 启动开发模式（React dev server + Electron）
npm run start    # 仅启动 React dev server
npm run ele      # 仅启动 Electron（需要先 build 或 start）
npm run build    # 构建 React 生产包
npm run release  # 构建桌面安装包（prerelease 自动先 build）
npm run rebuild  # 重新编译 better-sqlite3 原生模块
```

## electron-builder 配置（package.json build 字段）

- **appId**: `xyz.960960.koodo`
- **buildResources**: `assets/` 目录
- **文件关联**：epub、pdf、mobi、azw3、azw、cbz、cbr、cbt、cb7、fb2

## Windows 构建

目标格式：
- `nsis`（x64/ia32/arm64）— 主安装包，使用自定义 NSIS 脚本
- `zip`（x64）— 免安装压缩包
- `portable`（x64）— 便携版

NSIS 配置：
- `oneClick: true` — 一键安装，不允许更改目录
- `include: assets/windows/installer.nsh` — 自定义安装脚本
- 自定义宏：
  - `customInit`：安装前 kill 旧进程（`taskkill /f /im "Koodo Reader.exe"` + sleep 2s）
  - `customUnInstall`：卸载时询问是否删除用户数据

**已知问题**：`epub.ico` 被 Windows Shell 锁定时安装失败（见 [01-overview.md](01-overview.md)）

## macOS 构建

- 目标：dmg（x64 + arm64）
- 需要代码签名（identity: "Liang Guo"）和公证（notarize）
- 权限配置：`assets/macos/entitlements.mac.plist`

## Linux 构建

目标格式：snap、deb、rpm、AppImage（均为 x64）

## 阅读引擎

核心阅读引擎为 `kookit-extra`（闭源），以 `.min.mjs` 形式内置：
- `src/assets/lib/kookit-extra-browser.min` — 浏览器端
- `src/assets/lib/kookit-extra.min.mjs` — Electron 端（打包时需要显式包含）

## Docker 支持

提供 `Dockerfile` 和 `docker-compose.yml`，支持以 Web 服务形式部署（不含 Electron 功能）。
