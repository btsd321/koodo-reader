# Koodo Reader 项目概述

> 跨平台电子书阅读器，基于 Electron + React + TypeScript 构建。
> 版本：2.3.0 | 仓库：https://github.com/koodo-reader/koodo-reader

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面容器 | Electron 34 |
| 前端框架 | React 17 + TypeScript |
| 状态管理 | Redux + redux-thunk |
| 本地数据库 | better-sqlite3 |
| 配置存储 | electron-store |
| 路由 | react-router-dom v5 |
| 国际化 | i18next + react-i18next |
| 构建打包 | electron-builder 26 |

## 支持的书籍格式

EPUB、PDF、MOBI、AZW3、AZW、CBZ、CBR、CBT、CB7、FB2

## 云同步支持

WebDAV、FTP、SFTP、AWS S3、Mega、OneDrive、Google Drive、Dropbox

## 目录结构

```
koodo-reader/
├── main.js              # Electron 主进程入口
├── package.json         # 依赖配置 & electron-builder 构建配置
├── webpack.config.js    # Webpack 配置
├── tsconfig.json        # TypeScript 配置
├── assets/              # 构建资源（图标、平台配置）
│   ├── icons/           # 应用图标 & 文件关联图标（epub/pdf/mobi等）
│   ├── windows/         # Windows NSIS 安装脚本 (installer.nsh)
│   └── macos/           # macOS 权限配置
├── public/              # 静态资源（HTML模板、第三方库）
└── src/                 # React 前端源码
    ├── index.tsx        # 前端入口
    ├── i18n.tsx         # 国际化初始化（多语言检测与切换）
    ├── router/          # 路由配置
    ├── pages/           # 顶层页面（4个）
    ├── containers/      # Redux 连接的智能组件
    ├── components/      # 纯 UI 组件
    ├── models/          # TypeScript 数据模型
    ├── store/           # Redux Store（actions + reducers）
    ├── utils/           # 工具函数
    └── assets/          # 前端资源（图片、字体、lib）
```

## 模块文档索引

- [02-electron-main.md](02-electron-main.md) - Electron 主进程
- [03-frontend-pages.md](03-frontend-pages.md) - 前端页面与路由
- [04-components.md](04-components.md) - 组件体系
- [05-state-management.md](05-state-management.md) - 状态管理
- [06-utils.md](06-utils.md) - 工具函数层
- [07-build-packaging.md](07-build-packaging.md) - 构建与打包

## 已知问题

### Windows 安装时 epub.ico 被锁定

**现象**：安装/更新时报错 "不能打开要写入的文件: .../resources/epub.ico"

**根本原因**：
1. `epub.ico` 被注册为 `.epub` 文件关联图标后，Windows Shell (Explorer.exe) 会持有该文件句柄
2. `assets/windows/installer.nsh` 中的 `customInit` 宏只 kill 了 `Koodo Reader.exe` 进程并等待 2 秒
3. Shell 对图标文件的缓存锁不会因杀掉应用进程而释放

**相关文件**：`assets/windows/installer.nsh`
