---
title: FTB Solo Quests v1.1.2 开发日志
summary: 记录 FTB Solo Quests 开发初期的问题和心得。
draft: false
category: devlog
tags:
    - minecraft
    - utility
featured: false
work: ftb-solo-quests
publishedAt: "2026-08-21T00:36:31+08:00"
---

> 记录周期：2026-08-07 ～ 2026-08-10（初版工程骨架 → v1.1.2）
> 当前版本：1.1.2（Minecraft 1.21.1，NeoForge / Fabric；另维护 1.20.1 Forge）

## 项目一句话

通过服务端 Mixin 把 FTB Quests 的进度键从"队伍 UUID"改为"玩家 UUID"，实现同队伍成员任务进度各自独立，并提供队伍内同步能力（1.1.0 起）。

---

## 版本里程碑

| 版本 | 日期 | 主题 |
|---|---|---|
| 1.0.0 | 2026-08-07 | 核心功能：进度按玩家独立 + 旧存档迁移 |
| 1.1.0 | 2026-08-08 | 队伍同步按钮 + 管理命令 + 配置 + 工程质量大修 |
| 1.1.1 | 2026-08-09 | 版本显示 / tooltip 修复 + @Overwrite 收敛与平台代码隔离（1.21.1 迁移前置清理） |
| 1.1.2 | 2026-08-10 | 1.21.1 NeoForge / Fabric 双端支持 |

---

## 2026-08-07 —— 1.0.0：核心功能落地

### 工程起点

- 初始提交：`.gitignore`、Forge 1.20.1 mod 工程骨架（手写 build.gradle，ForgeGradle + Mojmap + Java 17）
- 引入 FTB Quests / FTB Teams / FTB Library / Architectury 依赖（CurseMaven）

### 核心 Mixin（进度重键）

- `BaseQuestFileMixin`：主入口 `getOrCreateTeamData(Entity)` 重键为玩家 UUID（唯一主入口，一处改动覆盖击杀/合成/领取/登录同步全部路径）
- `ServerQuestFileMixin`：中和三处必须处理的边界
  - `playerChangedTeam`：移除入队合并 / 离队归还（否则进度串队）
  - `teamCreated`：移除建队时复制创建者个人进度
  - `isPlayerOnTeam`：改为按玩家 UUID 比对（否则置顶任务等 per-player 功能失效）
- `FTBQuestsInventoryListenerMixin`：detect 走 `getNullableTeamData(team.getId())` 绕过主入口，需独立覆盖

### 存档迁移模块

- `MigrationManager`：扫描 party 档（含 `-` 且 `.snbt` 结尾）→ 备份 → 按成员复制合并（进度取更优值、claimed_rewards 按本人过滤、per_player_data 按本人过滤）→ 改名 `.migrated` 防重复迁移
- 加载时机定为 `ServerStarting`（玩家登录前完成迁移）
- 实测修复一批 bug（`fix: 修复实测bug`）

### 生产环境修复

- 生产 jar 缺 refmap 导致 `MixinApplyError`（crash 报告验证）→ 引入 MixinGradle 注解处理器生成 refmap
- mods.toml 补 ftbquests / ftbteams / ftblibrary / architectury 硬依赖声明
- `fix: 修复生产环境 mixin 未注册`

---

## 2026-08-08 —— 1.1.0：队伍同步 + 工程质量大修

### 新功能

- **任务详情同步按钮**（`TeamSyncButton`）：同步单任务完成状态，图标实时反映队伍中是否有人已完成（客户端 GUI Mixin，打破纯服务端约束，改为"服务端必需 + 客户端可选增强"）
- **同步所有按钮**（`OtherButtonsPanelTopMixin`）：任务书右侧栏一次同步全部未完成任务；`fix: 同步所有任务改为服务端迭代拓扑`（修复任务链漏同步）
- **/soloquests 命令**：`migrate`（手动重跑迁移）、`status`（查看迁移状态）
- **teamSyncEnabled 服务端配置**：总开关，同时控制客户端按钮显示（服务端推送开关状态）

### 修复

- 依赖任务未完成时同步导致进度 100% 永久卡死（同步前校验依赖，已损坏任务可恢复）
- lang 资源不加载（补 pack.mcmeta），tooltip 改 i18n（en_us / zh_cn）
- 建队产生无用的 party 空档文件（`setName` → `markDirty` → 保存空档 → 迁移误判；teamCreated 跳过 PartyTeam）
- 客户端同步缓存跨服残留（登出时 reset）
- mixin 全部改显式 `remap = false`（全部注入 FTB 类，无需混淆映射）

### 性能与质量

- 任务完成推送改增量小包（原全量 O(任务数×成员数) 重算，登录/换队保留全量兜底）
- 迁移模块健壮性：按需备份（仅存在 party 档才备份）、逐文件异常隔离、`System.out` 全部换 LOGGER
- `@Overwrite` 收敛为 `@Inject`/`@Redirect`（`isPlayerOnTeam`/`teamCreated`/`playerChangedTeam`），`playerLoggedIn`/`detect` 保留并标注上游版本风险
- 网络注册正规化（`SimpleNetworkManager`，去掉 `NET.hashCode()` 强制加载 hack）
- 版本号集中到 gradle.properties；MergeRules 从迁移逻辑抽取为独立类
- 补充 README.md / CHANGELOG.md / LICENSE

---

## 2026-08-09 —— 1.1.1：修复与迁移前置清理

### 修复

- 正式 jar 在 mod 列表版本显示 0.0NONE（jar manifest 补 `Implementation-Version`，`${file.jarVersion}` 占位符正确替换）
- 任务完成后同步按钮图标隐藏，但鼠标悬浮提示仍显示（tooltip 与按钮同条件隐藏）

### 1.21.1 迁移前置清理（对应《1.1.1 更新方案》阶段 0）

- 收敛 `playerLoggedIn`：`@Overwrite` 整段照抄 → `@Inject(HEAD)` 推状态 + `@Redirect` 拦截 `getOrCreateTeamData(Team)` 调用
- 隔离平台代码：入口 / 配置 / 命令 / 客户端事件与共享逻辑（TeamSyncHandler / 迁移 / 网络 / 缓存）剥离开
- 修复换队后同步图标过期
- 附带：sync 处理器 `getOrCreateTeamData(memberId)` → `getNullableTeamData`（避免为从未上线的成员创建空档）

---

## 2026-08-10 —— 1.1.2：双端支持（1.21.1 NeoForge / Fabric）

### Architectury 多模块迁移

- 工程重构为 `common + neoforge + fabric` 多模块（每 MC 版本一个 git 分支，分支内 Architectury 结构）
- **1.21.1 NeoForge 跑通**：JDK 17 → 21，`ForgeConfigSpec` → `NeoForgeConfigSpec`，事件包路径更新，逐文件 diff 上游 `1.21.1/main` 源码核验 API
- **1.21.1 Fabric 跑通**：mixin 公共化，移除全部显式 `remap = false`（双端注入的都是 FTB 类，无需映射处理）；Fabric 端 mixin remap 策略是唯一实验探索点
- 1.21.1 起 ftb-quests-fabric 内嵌 jar-in-jar 依赖（teamreborn:energy），dev 环境需显式 `modRuntimeOnly`

### 收尾

- 统一构建产物名（去掉 -neoforge 后缀冗余），放宽前置 mod 版本要求
- 适配 1.21.1 上游 API 变更（TeamData 构造器、PlayerLoggedInAfterTeamEvent 等）
- 固化《新版本迁移工作流》：建分支 → 拉上游源码 diff → 迁 common → 重写 mixin → 回归清单

---

## 已知问题（截至 1.1.2）

| 问题 | 状态 |
|---|---|
| mod 功能仅在专用服务器生效；局域网联机（内置服务器 / LAN）完全无效 | 待修复（已追踪） |
| FTB Quests 2101.1.30 官方 bug：客户端连接服务器瞬间偶发一次性 NPE（`ClientQuestFile.INSTANCE` 未初始化，官方 `syncTeamData` 无空值保护；Fabric 时序更易触发，无功能影响） | 上游问题，规避 |

## 核心技术备忘

- **重键原理**：`teamDataMap : Map<UUID, TeamData>` 的键从队伍 ID 改为玩家 UUID；`TeamData` 内部逻辑一行不改；FTB Teams 的圈地/区块共享走自己的数据，不受影响
- **mixin 均为注入 FTB 类**：目标方法两端同名，无需 refmap；若未来注入 MC 类需重新评估 refmap 配置
- **升级风险控制**：锁定 FTB Quests 版本（gradle 依赖写死 tag），mixin 优先 `@Inject`/`@Redirect`，升级前跑回归清单
