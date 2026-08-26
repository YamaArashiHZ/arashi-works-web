---
title: Minecraft Survival Datapack
summary: 为生电玩家打造的 Minecraft 合成表数据包——大量可再生配方、切石/烧炼优化、原矿合成与通用染色，兼顾生存与建筑玩家的需求。
type: mod
status: maintained
draft: false
featured: true
publishedAt: "2023-05-28T03:20:18+08:00"
updatedAt: "2024-07-29T09:28:41+08:00"
tags:
    - minecraft
    - utility
platforms:
    - windows
repositoryUrl: https://github.com/YamaArashiHZ/Minecraft-Survival-Datapack
feedbackUrl: https://github.com/YamaArashiHZ/Minecraft-Survival-Datapack/issues
cover: ./assets/cover.webp
---

Minecraft Survival Datapack 是一款为**生电玩家**打造的 Minecraft 合成表数据包：为原版补齐大量可再生配方、切石与烧炼优化、原矿合成以及通用染色，让几乎所有物品都能通过生存方式再生，同时尽量兼顾获得难度、降低对游戏平衡的冲击。

数据包参考并优化了 [SunnySlopes](https://space.bilibili.com/100377977) 的早期数据包逻辑，补充了大量新配方，并针对生存与建筑两类玩家做了取舍。

## 食用方法

- **单机存档**：把数据包压缩包丢进对应世界目录的 `datapacks` 文件夹（如 `\.minecraft\saves\新世界\datapacks`），重进存档或执行 `/datapack enable "file/CraftingDatapack-vx.x.zip"`。
- **服务器**：丢进 `world\datapacks`，控制台或管理员执行 `/datapack enable "file/CraftingDatapack-vx.x.zip"`。

## 配方分类

### 便利（Conveniences）

- 切石机可切木头（木板/木台阶），也能切更多制品
- 骨块、面包、纸、潜影盒、投掷器、灵魂沙→灵魂土等无序合成
- 投掷器/发射器批量合成，减少手残合成一背包的尴尬

### 原版优化（Vanilla Optimization）

- **深板岩圆石与黑石成为圆石的替代品**：投掷器、发射器、侦测器、活塞、拉杆等可使用废石类原料

### 再生（Renewables）

为以下物品添加可再生配方（多项为合成/烧炼/切石）：

远古残骸、珊瑚块、收纳袋、黏土、蜘蛛网、铁/金马铠、龙首、鞘翅、镶金黑石、海洋之心、下界合金碎片（改为切石机配方）、方解石、枯萎的灌木、深板岩、下界岩、附魔金苹果、猪鼻旗帜图案、Pigstep/Otherside 唱片、海绵、孢子花、凝灰岩。

### 原矿合成（Ore Crafting）

主世界矿石的深板岩变种以深板岩替换石头，且为无序合成，用粗矿/粗矿块合成矿石（可被时运加成）：

| 矿石 | 时运三期望 | 备注 |
| --- | --- | --- |
| 煤矿 / 铁 / 金矿 | 2.2 | 铁/金用粗矿合成 |
| 钻石矿 | 2.2 | |
| 红石矿 | 6 | |
| 铜矿 | 7.7 | 需粗铜块，因期望过高 |
| 青金石矿 | 14.3 | |
| 下界金矿 | 8.8 金粒 | |
| 石英矿 | 2.2 | |

### 通用染色（Universal Dyeing）

- 染色直接用染料的**原材料**即可（需烧炼的如仙人掌除外）
- 已染色物品可直接重新染色；用水桶可去除颜色
- ⚠️ 潜影盒染色/去色前务必先把里面的东西拿出来

## 设计理念

- **可再生的标准（防杠）**：只要存在主流且专门的获得方式（包括利用 bug 的刷沙机、非随机的流浪商人/末影龙等），就视为可再生；随机性方式（如末影龙）不算，因此粘土与珊瑚块的合成仍保留。
- **造价对等**：尽量让原料获得性与产物对等，减少对难度的影响；所以像鞘翅这类物品造价仍然很高，且合成会**消除鞘翅附魔**。
- **注意**：数据包添加的合成配方**无法保留物品的 NBT 数据**。

## 兼容性

- 支持 1.19.x、1.20.x，1.21 适配（配方分类与 JSON 格式随版本调整）
- 提供 CHANGELOG 记录版本与变更

> 本数据包遵循原版游戏内容与社区配方逻辑制作，仅作配方补充，不修改主线游戏机制。
