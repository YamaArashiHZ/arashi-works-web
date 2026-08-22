---
title: FTB Solo Quests
summary: 让 FTB Quests 的任务进度按玩家独立存储，并提供队伍内同步能力。
type: mod
status: maintained
draft: false
featured: true
publishedAt: "2026-08-21T00:30:30+08:00"
tags:
    - minecraft
    - utility
platforms:
    - windows
repositoryUrl: https://github.com/YamaArashiHZ/ftb-solo-quests
feedbackUrl: https://github.com/YamaArashiHZ/ftb-solo-quests/issues
license: MIT
cover: ./assets/cover.webp
---

让 FTB Quests 的任务进度按玩家独立存储，并提供队伍内同步能力。

## 功能

- 任务进度按玩家独立
- 任务详情面板同步按钮：把队伍中某成员已完成的任务进度同步到本人
- 任务书右侧栏“同步所有任务”按钮：一次同步全部未完成任务
- /soloquests 管理命令：migrate（手动迁移旧存档队伍数据）、status（查看迁移状态）
- teamSyncEnabled 配置：总开关，同时控制客户端按钮显示

## 兼容性

- Minecraft 1.21.1
- NeoForge 21.1.213
- Fabric 0.15.11 + Fabric API 0.102.1
- 依赖：FTB Quests、FTB Teams、FTB Library、Architectury API

## 配置

- NeoForge：world/serverconfig/ftb_solo_quests-server.toml
- Fabric：config/ftb-solo-quests.toml（首次启动自动生成）
- teamSyncEnabled（默认 true）：设为 false 后玩家不可同步队伍任务进度

## 命令

- /soloquests migrate：手动执行旧存档迁移（权限等级 2）
- /soloquests status：查看存档迁移状态

## 旧存档迁移

会自动将旧版按队伍存储的任务进度迁移到各玩家个人档（迁移前自动备份）。

## 已知问题

- FTB Quests 2101.1.30 官方 bug：客户端连接服务器瞬间偶发一次性 NPE（无功能影响，详见 CHANGELOG）

## 许可证

MIT License

