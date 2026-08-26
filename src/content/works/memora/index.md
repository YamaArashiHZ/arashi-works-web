---
title: Memora 群忆
summary: AstrBot 的 QQ 群长期记忆插件，从群聊提炼长期事实，具备来源证据、置信度、状态与不可变版本历史，高风险候选需管理员审批，并按记忆组严格隔离。
type: plugin
status: maintained
draft: false
featured: true
publishedAt: "2026-07-30T20:00:00+08:00"
updatedAt: "2026-07-30T20:00:00+08:00"
tags:
    - astrbot
    - ai
    - utility
platforms:
    - linux
repositoryUrl: https://github.com/YamaArashiHZ/astrbot_plugin_memora
feedbackUrl: https://github.com/YamaArashiHZ/astrbot_plugin_memora/issues
license: AGPL-3.0
cover: ./assets/cover.webp
---

Memora（群忆）是一款面向 AstrBot 的 QQ 群**长期记忆**插件：从群聊消息中提炼成员信息、群体共识、项目、活动、待办等长期有效事实，让机器人"记住"这个群，而不是每次对话都从头开始。

与简单记录聊天历史不同，Memora 把"记忆"当作**可审计、可审批、可撤销的数据资产**：每条事实都有来源证据、置信度与不可变版本历史，高风险、冲突、低置信及敏感候选必须先经管理员审批，并严格按记忆组隔离。

## 功能

- 从群聊消息中提炼成员信息、群体共识、项目、活动、待办等长期有效事实
- 一个记忆组可包含多个群，在组内共享事实
- 所有查询、索引、注入和工具调用严格按记忆组隔离，不存在跨组捷径
- 事实具有来源证据、置信度、状态和不可变版本历史
- 高风险、冲突、低置信及敏感候选必须由管理员审批
- 提供完整 Plugin Page WebUI 管理能力（记忆组、Provider、索引、审计）

## 兼容性

- AstrBot `>= 4.26.8, < 5`（基线 v4.26.8）
- NapCat + OneBot 11（AstrBot `aiocqhttp` 平台接入）
- Python 3.11+

## 配置

全部配置通过 Plugin Page WebUI 管理，无需编辑配置文件。首次安装后：

1. 打开 AstrBot Dashboard → Plugin Page → Memora
2. 在「记忆组」页面创建记忆组并绑定 QQ 群
3. 在 Provider 页面选择提炼 Provider、Embedding Provider（可选）、Reranker Provider（可选）
4. 消息采集自动开始

默认配置项见 `migrations/0001_initial.sql` 中 settings 表的初始值。

## 管理命令

| 命令 | 说明 |
| --- | --- |
| `/memora_status` | 查看插件运行状态和能力矩阵 |
| `/memora_search query=关键词 [fact_type=类型]` | 搜索当前记忆组事实 |
| `/memora_whois qq=QQ号 或 name=昵称` | 查询成员记忆档案 |
| `/memora_timeline subject=主题` | 查看时间线条目 |

> 首版不提供 QQ 聊天内的管理命令。所有管理操作通过 Plugin Page 完成。

## 数据与隐私

- **原文明文保留**：规范化后的消息正文在 SQLite 中明文保留最多 30 天（默认），到期自动脱敏（清除正文与可识别段信息，保留不可逆哈希与最小证据摘要）
- **持久化要求**：必须持久化 AstrBot data 目录，否则容器重建会丢失全部事实与索引
- **FAISS 非备份源**：FAISS 索引文件可从 SQLite 完全重建，备份至少应包含 SQLite 数据库
- **Embedding 切换**：切换 Embedding Provider 或模型会触发全量索引重建
- **Provider 隔离**：提炼 Provider 故障不会回退到聊天模型执行提炼，避免污染对话上下文
- **权限边界**：QQ 群管理员身份不等于 Dashboard 管理权限，`admins_id` 仅用于群事实管理员证据与告警接收者候选
- **不采集内容**：Bot 回复、语音正文、文件正文、图片二进制均不采集；语音和视频仅保留占位标签

## 数据目录布局

```text
<astrbot-data>/plugin_data/astrbot_plugin_memora/
├── memora.sqlite3          # 主数据库（事实、候选、消息、审计等）
├── indexes/
│   ├── <memory_group_id>.faiss      # 每组独立 FAISS 索引
│   └── <memory_group_id>.meta.json  # 索引元数据（指纹、维度、ID映射）
├── backups/                # 备份目录
└── runtime/                # 运行时临时文件
```

## 备份与恢复

### 备份

1. 在 Plugin Page 停用所有记忆组（暂停写任务）
2. 执行 SQLite 在线备份或 WAL checkpoint 后复制数据库文件
3. 可选：复制 FAISS 索引文件（恢复后仍需运行一致性检查）

### 恢复

1. 停止 AstrBot
2. 恢复 SQLite 数据库到原路径
3. 删除所有 FAISS 索引文件（启动后自动重建）
4. 重新启用记忆组
5. 启动 AstrBot，在索引页面确认各组状态为 `ready`

## 故障降级行为

| 故障场景 | 行为 |
| --- | --- |
| 提炼 Provider 未配置 | 消息正常保留，任务进入 `blocked_provider`，恢复配置后自动重排 |
| FAISS 不可用 | 自动回退到 FTS5 单路检索，聊天不受影响 |
| FTS5 不可用 | 自动回退到 FAISS 单路检索 |
| FTS5 + FAISS 均不可用 | 不注入动态事实，正常聊天继续 |
| 知识库检索失败 | 单个 KB 失败不取消其他来源，超时 2 秒后返回已有结果 |
| 图片转述 Provider 不可用 | 消息仍正常入库，使用 `[图片]` 占位 |
| Embedding Provider 缺失 | 禁用向量检索，回退 FTS |

## 许可证

本插件基于 [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html) 开源。
