# 组件体系

## 分层说明

- `src/containers/` — 智能组件（连接 Redux store，处理业务逻辑）
- `src/components/` — 纯 UI 组件（展示层，通过 props 驱动）

## Dialogs（对话框）

位于 `src/components/dialogs/`

| 组件 | 功能 |
|------|------|
| `aboutDialog` | 关于对话框 |
| `actionDialog` | 操作确认对话框 |
| `addDialog` | 添加书架/标签 |
| `backupDialog` | 备份数据 |
| `convertDialog` | 格式转换 |
| `deleteDialog` | 删除确认 |
| `deletePopup` | 删除弹窗 |
| `detailDialog` | 书籍详情 |
| `editDialog` | 编辑书籍信息 |
| `importDialog` | 导入书籍 |
| `loadingDialog` | 加载中 |
| `localFileDialog` | 本地文件选择 |
| `moreAction` | 更多操作菜单 |
| `settingDialog` | 设置主对话框 |
| `sortBookDialog` | 书籍排序 |
| `sortShelfDialog` | 书架排序 |
| `speechDialog` | 文字转语音设置 |
| `supportDialog` | 支持/反馈 |
| `updateDialog` | 更新提示 |

## Popups（弹出框）

位于 `src/components/popups/`，阅读时的上下文弹出功能：

| 组件 | 功能 |
|------|------|
| `popupAssist` | AI 助手弹窗 |
| `popupBox` | 通用弹出容器 |
| `popupDict` | 词典查询弹窗 |
| `popupMenu` | 右键菜单 |
| `popupNote` | 笔记记录弹窗 |
| `popupOption` | 选项弹窗 |
| `popupRefer` | 引用弹窗 |
| `popupTrans` | 翻译弹窗 |

## 其他 UI 组件

| 组件 | 功能 |
|------|------|
| `arrow` | 翻页箭头 |
| `background` | 背景渲染 |
| `bookCardItem` | 书籍卡片（卡片视图）|
| `bookCoverItem` | 书籍封面（网格视图）|
| `bookListItem` | 书籍列表项（列表视图）|
| `colorOption` | 颜色选择器 |
| `deleteIcon` | 删除图标按钮 |
| `emptyCover` | 无封面占位 |
| `imageViewer` | 图片查看器 |
| `importLocal` | 本地导入组件 |
| `noteTag` | 笔记标签 |
| `readerSettings` | 阅读器设置面板 |
| `searchBox` | 搜索框 |
| `selectBook` | 批量选书 |
| `textToSpeech` | 文字转语音控件 |
| `viewMode` | 视图模式切换 |
