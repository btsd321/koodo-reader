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
