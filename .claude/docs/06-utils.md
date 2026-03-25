# 工具函数层

## 目录结构

```
src/utils/
├── common.ts         # 通用工具函数
├── file/             # 文件处理相关
│   ├── backup.ts     # 数据备份
│   ├── bookUtil.ts   # 书籍文件工具（解析、加载）
│   ├── common.ts     # 文件通用工具
│   ├── configUtil.ts # 配置读写
│   ├── coverUtil.ts  # 书籍封面提取
│   ├── export.ts     # 导出功能
│   ├── googlePicker.ts # Google Drive 文件选择器
│   ├── localFile.ts  # 本地文件操作
│   ├── restore.ts    # 数据恢复
│   └── sqlUtil.ts    # SQLite 操作封装
├── request/          # 网络请求相关
│   ├── baiduPan.ts   # 百度网盘 OAuth 2.0 + 文件操作 API
│   ├── common.ts     # 通用请求工具（官方服务器调用已禁用）
│   ├── customAI.ts   # 自定义 AI 请求（替代官方服务器 AI 调用）
│   └── reader.ts     # 阅读器相关请求（使用 customAI 流）
├── storage/          # 云存储同步相关
│   ├── baiduSyncUtil.ts  # 百度网盘同步工具
│   └── syncService.ts    # 同步服务调度
└── reader/           # 阅读器相关
    ├── docUtil.ts    # 文档处理工具
    ├── launchUtil.ts # 启动/初始化工具
    ├── mouseEvent.ts # 鼠标事件处理
    ├── styleUtil.ts  # 阅读样式工具（字体、主题、间距等）
    ├── themeUtil.ts  # 主题切换
    └── ttsUtil.ts    # 文字转语音工具
```

## 重要工具说明

### sqlUtil.ts
SQLite 操作封装，通过 IPC 与主进程的 `better-sqlite3` 通信，实现书籍、笔记、书签等数据的 CRUD。

### bookUtil.ts
书籍文件工具：解析 EPUB/MOBI/PDF 等格式，提取元数据（标题、作者、封面），与阅读引擎 `kookit-extra` 协同。

### styleUtil.ts / themeUtil.ts
阅读器样式控制：字体大小、行间距、边距、背景主题（日间/夜间/护眼等）、自定义 CSS 注入。

### ttsUtil.ts
文字转语音：调用系统 TTS 或第三方服务，配合 `howler.js` 播放音频。

### configUtil.ts
配置读写封装，底层使用 `electron-store` 或 `localforage`（Web 模式）。

### baiduPan.ts
百度网盘 OAuth 2.0 授权流程及文件操作 API：
- 授权码换 token（`baiduExchangeToken`）、刷新 token（`baiduRefreshToken`）
- 文件列表（`baiduListFiles`）、获取下载链接（`baiduGetDownloadLink`）
- 分片上传（`baiduUploadFile`，4MB 分片）、删除（`baiduDeleteFile`）、创建目录（`baiduCreateFolder`）
- 回调地址固定为 `koodo-reader://oauth/baidu`，需在百度开放平台注册

### customAI.ts
自定义 AI 请求处理，支持配置第三方 AI 服务（API Key、模型、端点），替代官方服务器的 AI 翻译/词典/总结功能。`reader.ts` 中的 AI 相关请求均通过此模块路由。

### baiduSyncUtil.ts
基于 `baiduPan.ts` 实现的百度网盘数据同步工具，负责书库数据的上传与下载同步。

