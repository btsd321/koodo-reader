# 前端页面与路由

## 路由配置

入口：`src/router/index.tsx`，使用 `HashRouter`

| 路径 | 页面 | 说明 |
|------|------|------|
| `/manager` | `pages/manager` | 书库管理主界面 |
| `/login` | `pages/login` | 登录/账户界面 |
| `/reader` | `pages/reader` | 阅读器界面 |
| `/redirect` | `pages/redirect` | 跳转中间页 |

路由初始化时自动检测 `navigator.language` 设置 i18n 语言。

## 页面说明

### manager（书库管理）

核心书库界面，包含：
- `containers/header` - 顶部导航栏（搜索、视图切换、导入按钮）
- `containers/sidebar` - 侧边栏（分类、书架、标签导航）
- `containers/lists/` - 书籍列表展示
  - `bookList` - 网格/列表视图
  - `cardList` - 卡片视图
  - `contentList` - 目录视图
  - `deletedBookList` - 已删除书籍
  - `navList` - 导航列表
  - `noteList` - 笔记列表

### reader（阅读器）

阅读界面，包含：
- `containers/viewer` - 核心渲染区域（书籍内容展示）
- `containers/panels/` - 功能面板
  - `navigationPanel` - 目录/书签导航
  - `operationPanel` - 操作按钮面板
  - `progressPanel` - 阅读进度
  - `settingPanel` - 阅读设置（字体、主题等）

### settings（设置）

通过 `containers/settings/` 下的子模块管理：
- `generalSetting` - 通用设置
- `syncSetting` - 云同步设置（支持百度网盘 OAuth 2.0 授权）
- `accountSetting` - 账户设置（官方账户相关功能已禁用）
- `aiSetting` - 自定义 AI 配置（API Key、模型、端点，替代官方 AI 服务）
- `pluginSetting` - 插件设置

## 国际化

- 配置：`src/i18n.tsx`
- 语言文件：`src/assets/` 下的 i18n 资源
- 支持语言：简中、繁中（台湾/香港/澳门）、日语、俄语、罗马尼亚语、乌克兰语、斯洛文尼亚语、藏语、亚美尼亚语、希腊语等
