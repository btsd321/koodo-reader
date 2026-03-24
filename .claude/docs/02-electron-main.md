# Electron 主进程（main.js）

## 职责

主进程负责窗口管理、IPC 通信、本地文件系统访问、数据库连接、系统集成。

## 窗口体系

| 变量 | 说明 |
|------|------|
| `mainWin` | 主窗口（书库管理界面）|
| `readerWindow` / `readerWindowList` | 阅读窗口（支持多窗口）|
| `dictWindow` | 词典悬浮窗 |
| `transWindow` | 翻译窗口 |
| `linkWindow` | 链接预览窗口 |
| `chatWindow` | AI 聊天窗口 |
| `mainView` | 主窗口内嵌 WebContentsView |

## 关键设计

- **单实例锁**：`app.requestSingleInstanceLock()` 保证只有一个实例，第二次启动时聚焦已有窗口
- **文件关联**：非 macOS 平台从 `process.argv[1]` 读取打开的文件路径
- **数据库**：`better-sqlite3` 连接存储在 `dbConnection` 对象中（按连接标识缓存）
- **云同步工具缓存**：`syncUtilCache`、`pickerUtilCache` 缓存各云服务实例
- **用户数据目录**：`app.getPath("userData")` 下的 `uploads/` 存放书籍文件

## WebPreferences 配置

主窗口关闭了 `webSecurity` 和 `contextIsolation`，启用了 `nodeIntegration`，前端可直接调用 Node.js API（注意安全风险）。

## IPC 通信

渲染进程通过 `ipcRenderer` / `ipcMain` 与主进程通信，主要功能：
- 文件读写操作
- 数据库 CRUD
- 云同步操作
- 窗口控制（新建阅读窗口、词典窗口等）
- 系统功能（防止息屏、主题检测等）

## 日志

使用 `electron-log`，日志文件名 `debug.log`，最大 1MB。
