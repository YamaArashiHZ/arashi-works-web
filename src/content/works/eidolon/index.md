---
title: Eidolon
summary: 基于火山方舟 Doubao Seedream 5.0 Pro 的 AstrBot 群聊文生图/图生图插件，支持指令与自然语言触发、多图融合、三级限额、并发队列与 LLM 提示词润色。
type: software
status: maintained
draft: false
featured: false
publishedAt: "2026-08-01T12:00:00+08:00"
updatedAt: "2026-08-02T12:00:00+08:00"
tags:
    - utility
platforms:
    - linux
repositoryUrl: https://github.com/YamaArashiHZ/astrbot_plugin_eidolon
feedbackUrl: https://github.com/YamaArashiHZ/astrbot_plugin_eidolon/issues
license: MIT
cover: ./assets/eidolon_icon.webp
---

Eidolon（异画师）是一款面向 AstrBot 的群聊**文生图 / 图生图**插件，使用字节跳动火山方舟的 Doubao Seedream 5.0 Pro 生成图片，能把群聊里的奇思妙想"异"笔"画"出，一键成图。

## 功能

- 支持 `/画图` 与 `/draw` 指令，以及宽高比、分辨率参数。
- 支持图生图：附带图片或回复带图消息时，自动基于参考图片生成，支持单图编辑与多图融合。
- 可选群聊 `@机器人` 自然语言触发，支持自定义关键词或 LLM 意图判断。
- 支持可配置的全局并发队列，超出上限时即时反馈排队位置。
- 支持群冷却、每日总限额、个人每日限额和管理员豁免。
- 可调用 AstrBot 已配置的文本模型润色提示词，并支持独立设置润色超时。
- 支持限制本地图片缓存容量，超限后自动清理最旧图片，也可在管理页手动清空。
- 提供插件管理页面，用于配置服务、生成参数、缓存、用量限制和查看统计信息。

## 环境要求

- AstrBot `>=4.16,<5`
- `aiocqhttp` 平台
- 已开通火山方舟 Seedream 5.0 Pro，并拥有可用的 API Key

## 使用方法

```text
/画图 一只坐在云朵上的橘猫
/画图 赛博朋克城市夜景 -a 16:9 -s 1.5K
/draw 水彩风格的山间湖泊 -a 4:3 -s 2K
```

可用参数：

| 参数 | 说明 | 可选值 |
| --- | --- | --- |
| `-a` | 宽高比 | `1:1`、`16:9`、`9:16`、`4:3`、`3:4`、`3:2`、`2:3`、`21:9` |
| `-s` | 分辨率 | `1K`、`1.5K`、`2K` |

## 数据与缓存

插件配置、用量记录和生成图片保存在 `data/plugin_data/astrbot_plugin_eidolon/`，其中 `images/` 为生成图片缓存，达到配置的容量上限后自动清理最旧文件。

## 许可证

本插件基于 [MIT License](https://github.com/YamaArashiHZ/astrbot_plugin_eidolon/blob/main/LICENSE) 开源。
