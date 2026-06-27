# cf-vocab-worker

日语学习助手 - 基于 Cloudflare Worker 的单词本服务

## 功能特性

- **卡牌学习** - 翻转卡片查看详细信息，支持语音播放
- **词汇管理** - 搜索、筛选、分页，详情弹窗
- **添加词汇** - 手动输入翻译 / 从 JLPT 词库随机获取
- **翻译服务** - 调用 translate.luosc.org 获取译文、语音、百科

## 项目结构

```
cf-vocab-worker/
├── wrangler.toml                   # Cloudflare Worker 配置
├── package.json
├── tsconfig.json
├── schema.sql                      # 数据库建表 SQL
├── src/
│   ├── index.ts                    # Worker 入口 + 路由
│   ├── handlers/
│   │   ├── library.ts              # 词库随机获取 API
│   │   ├── learning.ts             # 学习词汇 CRUD API
│   │   └── translate-client.ts     # 调用翻译服务
│   └── pages/
│       └── page.ts                 # 前端页面 HTML
└── README.md
```

## 数据库表

| 表名 | 说明 |
|------|------|
| `word_library` | JLPT N1-N5 词汇+汉字（9408 条） |
| `learning_words` | 用户学习词汇 |

### word_library

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| word | TEXT | 词汇/汉字 |
| reading | TEXT | 假名读音 |
| word_type | TEXT | vocab / kanji |
| level | INTEGER | 1-5 (N1-N5) |
| is_added | INTEGER | 0=未添加 1=已添加 |

### learning_words

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| word | TEXT | 词汇/汉字 |
| reading | TEXT | 假名读音 |
| word_type | INTEGER | 1=手动 2=vocab 3=kanji |
| level | INTEGER | JLPT 1-5 |
| meaning_cn | TEXT | 中文释义 |
| word_type_detail | TEXT | 词性 |
| example_ja | TEXT | 例句（日） |
| example_cn | TEXT | 例句（中） |
| usage_note | TEXT | 用法说明 |
| speak_url | TEXT | 有道原文语音 |
| tspeak_url | TEXT | 有道译文语音 |
| minio_speak_url | TEXT | MinIO 原文语音 |
| minio_tspeak_url | TEXT | MinIO 译文语音 |
| dict_url | TEXT | 有道百科 |
| word_library_id | INTEGER | 词库表 ID |
| is_learned | INTEGER | 0=未学习 1=已学习 |
| created_at | DATETIME | 创建时间 |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/learning/cards?page=1` | 获取未学习卡牌（10条/页） |
| POST | `/api/learning/add` | 从词库添加（调用翻译） |
| POST | `/api/learning/manual` | 手动添加（调用翻译） |
| GET | `/api/learning/list?page=&status=&level=&type=&search=` | 查询学习词汇 |
| PUT | `/api/learning/:id/status` | 切换学习状态 |
| GET | `/api/learning/:id` | 获取词汇详情 |
| DELETE | `/api/learning/:id` | 删除词汇 |
| GET | `/api/library/random?type=&level=` | 随机获取未添加词汇 |

## 翻译服务

调用 `https://translate.luosc.org/api/aiTranslate`（带 CF Access 认证）

返回字段映射：
- `translated_text` → meaning_cn
- `reading` → reading
- `word_type` → word_type_detail
- `example_ja1` → example_ja
- `example_cn1` → example_cn
- `usage_note` → usage_note
- `jlpt_level` → level
- `speak_url` / `tspeak_url` → 语音 URL
- `minio_speak_url` / `minio_tspeak_url` → MinIO 语音 URL
- `dict_url` → 百科 URL

## 部署

```bash
# 安装依赖
npm install

# 创建 D1 数据库
wrangler d1 create vocab-db

# 执行建表 SQL
wrangler d1 execute vocab-db --file=schema.sql

# 部署
wrangler deploy
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `DB` | D1 数据库绑定 |
