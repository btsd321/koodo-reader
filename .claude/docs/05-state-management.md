# 状态管理

## Redux Store 结构

入口：`src/store/index.tsx`

分为 `actions/` 和 `reducers/` 两个目录。

## 数据模型（src/models/）

| 模型 | 文件 | 说明 |
|------|------|------|
| `Book` | Book.ts | 书籍基本信息（id、title、author、format、path、cover等）|
| `BookLocation` | BookLocation.ts | 阅读位置记录 |
| `Bookmark` | Bookmark.ts | 书签 |
| `Note` | Note.ts | 笔记/高亮/划线 |
| `DictHistory` | DictHistory.ts | 词典查询历史 |
| `HtmlBook` | HtmlBook.ts | HTML 格式书籍 |
| `Plugin` | Plugin.ts | 插件信息 |

## 数据持久化策略

- **书籍元数据、笔记、书签**：存储于 `better-sqlite3` 本地数据库（`userData/` 目录）
- **用户配置/偏好**：存储于 `electron-store`（JSON 文件）
- **书籍文件**：存储于 `userData/uploads/` 目录
- **云同步**：通过各云服务 SDK 同步数据库文件或书籍文件
