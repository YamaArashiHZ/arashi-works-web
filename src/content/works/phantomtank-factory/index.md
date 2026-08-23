---
title: PhantomTank Factory
summary: 选择表图与里图，生成「缩略图看一张、点开看另一张」的幻影坦克 PNG 的 Windows 桌面工具。
type: software
status: released
draft: false
featured: true
publishedAt: "2026-07-23T13:32:44+08:00"
updatedAt: "2026-08-23T20:03:34+08:00"
tags:
    - utility
platforms:
    - windows
repositoryUrl: https://github.com/YamaArashiHZ/PhantomTankFactory
feedbackUrl: https://github.com/YamaArashiHZ/PhantomTankFactory/issues
license: MIT
cover: ./assets/cover.webp
---

PhantomTank Factory 是一款面向 Windows 的幻影坦克合成工具：选择「表图」与「里图」，生成一张「缩略图看一张、点开看另一张」的 PNG。

> 幻影坦克是一种把两张图藏进同一张 PNG 的技巧：在浅色背景（如缩略图、列表页）下看到表图，在深色或非透明背景（如查看大图）下看到里图。

## 功能

- 表图 / 里图选择与预览
- 黑白 / 彩色双模式合成，两种模式参数独立记忆
- 亮度、对比度、饱和度调节（滑块平滑过渡）
- 白底表图 / 黑底里图实时效果预览（可开关、可调清晰度档位）
- 拖拽导入图片
- 导出 PNG 并一键打开保存目录
- 应用内签名验证自动更新

技术栈：Tauri 2、Vue 3、TypeScript（Naive UI）、Rust（`image` crate）。

## 下载

请从 [GitHub Releases](https://github.com/YamaArashiHZ/PhantomTankFactory/releases) 下载最新的 Windows 安装包。

系统要求：Windows 10/11 x64，已安装 [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)（多数系统已自带）。

## 说明与许可

- 本项目基于 MIT License 开源。
